const {
   Configuration,
   OpenAIApi
} = require('openai')
exports.run = {
   usage: ['ai', 'brainly', 'ai-img', 'chatgpt'],
   hidden: ['gpt'],
   category: 'utilities',
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
   }) => {
      try {
         if (command == 'ai' || command == 'brainly') {
            if (!m.quoted && !text) return client.reply(m.chat, Func.example(isPrefix, command, 'how to create an api'), m)
            if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `🚩 Text not found!`))
            client.sendReact(m.chat, '🕒', m.key)
            const configuration = new Configuration({
               apiKey: process.env.OPENAI_API_KEY
            })
            const openai = new OpenAIApi(configuration)
            const json = await openai.createCompletion({
               model: 'text-davinci-003',
               prompt: m.quoted ? cut(m.quoted.text) : cut(text),
               temperature: 0.7,
               max_tokens: 3500,
               top_p: 1,
               frequency_penalty: 0,
               presence_penalty: 0,
            })
            if (json.statusText != 'OK' || json.data.choices.length == 0) return client.reply(m.chat, global.status.fail, m)
            client.reply(m.chat, json.data.choices[0].text.trim(), m)
         } else if (command == 'chatgpt' || command == 'gpt') {
            global.db.gpt = global.db.gpt ? global.db.gpt : {}
            if (!global.db.gpt[m.sender]) global.db.gpt[m.sender] = []
            if (global.db.gpt[m.sender].length >= 7) global.db.gpt[m.sender] = [global.db.gpt[m.sender][global.db.gpt[m.sender].length - 1]]
            if (!m.quoted && !text) return client.reply(m.chat, Func.example(isPrefix, command, 'how to create an api'), m)
            if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `🚩 Text not found!`))
            client.sendReact(m.chat, '🕒', m.key)
            const configuration = new Configuration({
               apiKey: process.env.OPENAI_API_KEY
            })
            const openai = new OpenAIApi(configuration)
            const json = await openai.createChatCompletion({
               model: 'gpt-3.5-turbo',
               messages: [{
                     'role': 'system',
                     'content': require('fs').readFileSync('./media/prompt.txt', 'utf-8')
                  },
                  ...(global.db.gpt[m.sender].map((msg) => ({
                     role: msg.role,
                     content: msg.content
                  })) || []),
                  {
                     'role': 'user',
                     'content': m.quoted ? cut(m.quoted.text) : cut(text),
                  }
               ],
               temperature: 0.7,
               top_p: 1,
               max_tokens: 3500
            })
            if (json.statusText != 'OK' || json.data.choices.length == 0) return client.reply(m.chat, global.status.fail, m)
            global.db.gpt[m.sender].push({
               role: 'user',
               content: m.quoted ? cut(m.quoted.text) : cut(text)
            })
            global.db.gpt[m.sender].push({
               role: 'assistant',
               content: cut(json.data.choices[0].message.content.trim(), 100)
            })
            client.reply(m.chat, json.data.choices[0].message.content.trim(), m)
         } else if (command == 'ai-img') {
            if (!m.quoted && !text) return client.reply(m.chat, Func.example(isPrefix, command, 'snow fox'), m)
            if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `🚩 Text not found!`))
            client.sendReact(m.chat, '🕒', m.key)
            const configuration = new Configuration({
               apiKey: process.env.OPENAI_API_KEY
            })
            const openai = new OpenAIApi(configuration)
            const json = await openai.createImage({
               prompt: m.quoted ? cut(m.quoted.text) : cut(text),
               n: 1,
               size: '512x512'
            })
            if (json.statusText != 'OK' || json.data.data.length == 0) return client.reply(m.chat, global.status.fail, m)
            client.sendFile(m.chat, json.data.data[0].url, '', '', m)
         }
      } catch (e) {
         console.log(e)
         client.reply(m.chat, global.status.fail, m)
      }
   },
   limit: true,
   error: false
}

const cut = (s, n = 60) => {
   var cut = s.indexOf(' ', n)
   if (cut == -1) return s
   return s.substring(0, cut)
}