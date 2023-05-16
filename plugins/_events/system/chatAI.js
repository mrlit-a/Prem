const { Configuration, OpenAIApi } = require('openai')
exports.run = {
   async: async (m, {
      client,
      body,
      chats,
      setting
   }) => {
      try {
         if (body && global.evaluate_chars.some(v => body.startsWith(v)) || body && Func.socmed(body)) return
         global.db.chatroom = global.db.chatroom ? global.db.chatroom : []
         const room = global.db.chatroom.find(v => v.jid == m.sender)
         const hint = [
            'kamu siapa?',
            'kamu siapa',
            'siapa?',
            'siapa',
            'mau curhat',
            'who are you?',
            'who are you'
         ]
         if (m.isGroup) {
            if (body && hint.includes(body.toLowerCase())) return m.reply('Hi, i\'am Neoxr Bot\nDo you want to chat with me? send *bot* to create a chat session.')
            for (let jid of [...new Set([...(m.mentionedJid || [])])]) {
               if (jid != client.decodeJid(client.user.id)) continue
               if (!m.fromMe) return m.reply('Do you want to chat with me? send *bot* to create a chat session.')
            }
            if (body && body.toLowerCase() == 'bot' && !room) {
               if (global.db.chatroom.length >= 1) return m.reply('Chatroom is full waiting for the next turn.')
               return m.reply('✅ Chat session created successfully.\nSend any text then bot will response, to remove chat session send *stop*.').then(() => global.db.chatroom.push({
                  jid: m.sender,
                  created_at: new Date * 1
               }))
            } else if (body && body.toLowerCase() == 'bot' && room) return m.reply('You have been in a chat session.')
            if (body && body.toLowerCase() == 'stop' && room) return m.reply('✅ Chat session deleted successfully.').then(() => Func.removeItem(global.db.chatroom, room))
            if (room && /conversation|extended/.test(m.mtype)) {
               global.db.gpt = global.db.gpt ? global.db.gpt : {}
               if (!global.db.gpt[m.sender]) global.db.gpt[m.sender] = []
               if (global.db.gpt[m.sender].length >= 7) global.db.gpt[m.sender].slice(6)
               // client.sendReact(m.chat, '🕒', m.key)
               const configuration = new Configuration({
                  apiKey: process.env.OPENAI_API_KEY
               })
               const openai = new OpenAIApi(configuration)
               const json = await openai.createChatCompletion({
                  model: 'gpt-3.5-turbo',
                  messages: [{
                        'role': 'system',
                        'content': require('fs').readFileSync('./media/prompt.txt', 'utf-8')
                        // 'content': 'Your name is NEOXR-GPT, A polite helpful assistant. When asked who designed you, you say that you were designed by Wildan Izzudin (https://github.com/neoxr) and remember his name when someone mentions his name'
                     },
                     ...(global.db.gpt[m.sender].map((msg) => ({
                        role: msg.role,
                        content: msg.content
                     })) || []),
                     {
                        'role': 'user',
                        'content': body,
                     }
                  ],
                  temperature: 0.7,
                  top_p: 1,
                  max_tokens: 3500
               })
               if (json.statusText != 'OK' || json.data.choices.length == 0) return client.reply(m.chat, global.status.fail, m)
               global.db.gpt[m.sender].push({
                  role: 'user',
                  content: body
               })
               global.db.gpt[m.sender].push({
                  role: 'assistant',
                  content: json.data.choices[0].message.content.trim()
               })
               client.reply(m.chat, json.data.choices[0].message.content.trim(), m)
            }
         } else {
            if (!setting.chatbot || body && body.match(/\d{3}-\d{3}/) || !/conversation|extended/.test(m.mtype)) return
            if (body && hint.includes(body.toLowerCase())) return m.reply('Hi, i\'am Neoxr Bot')
            global.db.gpt = global.db.gpt ? global.db.gpt : {}
            if (!global.db.gpt[m.sender]) global.db.gpt[m.sender] = []
            if (global.db.gpt[m.sender].length >= 7) global.db.gpt[m.sender] = []
            // client.sendReact(m.chat, '🕒', m.key)
            const configuration = new Configuration({
               apiKey: process.env.OPENAI_API_KEY
            })
            const openai = new OpenAIApi(configuration)
            const json = await openai.createChatCompletion({
               model: 'gpt-3.5-turbo',
               messages: [{
                     'role': 'system',
                     'content': require('fs').readFileSync('./media/prompt.txt', 'utf-8')
                     // 'content': 'Your name is NEOXR-GPT, A polite helpful assistant. When asked who designed you, you say that you were designed by Wildan Izzudin (https://github.com/neoxr) and remember his name when someone mentions his name'
                  },
                  ...(global.db.gpt[m.sender].map((msg) => ({
                     role: msg.role,
                     content: msg.content
                  })) || []),
                  {
                     'role': 'user',
                     'content': body,
                  }
               ],
               temperature: 0.7,
               top_p: 1,
               max_tokens: 3500
            })
            if (json.statusText != 'OK' || json.data.choices.length == 0) return client.reply(m.chat, global.status.fail, m)
            global.db.gpt[m.sender].push({
               role: 'user',
               content: body
            })
            global.db.gpt[m.sender].push({
               role: 'assistant',
               content: json.data.choices[0].message.content.trim()
            })
            client.reply(m.chat, json.data.choices[0].message.content.trim(), m)
         }
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}