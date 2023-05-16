exports.run = {
   usage: ['cnn'],
   hidden: ['cnnget'],
   category: 'utilities',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         global.cnn = global.cnn ? global.cnn : []
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         const check = global.cnn.find(v => v.jid == m.sender)
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.cnn(check.results[Number(text) - 1])
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let text = `*${json.data.title.toUpperCase()}*\n`
            text += `Author by *${json.data.author}*\n`
            text += `Published at : *${json.data.posted_at}*\n\n`
            text += json.data.content + '\n\n'
            text += `Source : ${json.data.source}`
            client.sendMessageModify(m.chat, text, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.data.thumbnail),
               link: json.data.source
            })
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.cnn(text)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               global.cnn.push({
                  jid: m.sender,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To read news use this command *${isPrefix + command} number*\n`
            p += `*Example* : ${isPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i+1}*. ${v.title}\n`
               p += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = global.cnn.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > global.timer) {
               Func.removeItem(global.cnn, session)
            }
         }, 60_000)
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}