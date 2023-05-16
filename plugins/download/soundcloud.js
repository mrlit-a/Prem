exports.run = {
   usage: ['soundcloud'],
   hidden: ['scdl'],
   use: 'query / link',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} :\n\n${isPrefix + command} tak ingin usai\n${isPrefix + command} https://soundcloud.com/cipilatoz/keisya-levronka-tak-ingin-usai`, m)
         global.soundcloud = global.soundcloud ? global.soundcloud : []
         const check = global.soundcloud.find(v => v.jid == m.sender)
         if (check && text.match('soundcloud.com')) {
            const json = await Api.soundcloud(text)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            return client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
               document: true
            })
         }
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.soundcloud(check.results[Number(text) - 1])
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
               document: true
            })
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.soundcloud(text)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (text.match('soundcloud.com')) return client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
               document: true
            })
            if (!check) {
               global.soundcloud.push({
                  jid: m.sender,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To download use this command *${isPrefix + command} number*\n`
            p += `*Example* : ${isPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i+1}*. ${v.artist + ' – ' + v.title}\n`
               p += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = global.soundcloud.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > global.timer) {
               Func.removeItem(global.soundcloud, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
}