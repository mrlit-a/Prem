exports.run = {
   usage: ['apk'],
   hidden: ['getapk'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      args,
      isPrefix,
      command
   }) => {
      try {
         global.apk = global.apk ? global.apk : []
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         const check = global.apk.find(v => v.jid == m.sender)
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.apk(check.query, Number(text))
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let teks = `乂  *P L A Y S T O R E*\n\n`
            teks += '	◦  *Name* : ' + json.data.name + '\n'
            teks += '	◦  *Version* : ' + json.data.version + '\n'
            teks += '	◦  *Size* : ' + json.file.size + '\n'
            teks += '	◦  *Category* : ' + json.data.category + '\n'
            teks += '	◦  *Developer* : ' + json.data.developer + '\n'
            teks += '	◦  *Requirement* : ' + json.data.requirement + '\n'
            teks += '	◦  *Publish* : ' + json.data.publish + '\n'
            teks += '	◦  *Link* : ' + json.data.playstore + '\n\n'
            teks += global.footer
            let chSize = Func.sizeLimit(json.file.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.file.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(json.file.url)).data.url}`, m)
            client.sendFile(m.chat, json.data.thumbnail, '', teks, m).then(() => {
               client.sendFile(m.chat, json.file.url, json.file.filename, '', m)
            })
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.apk(text)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               global.apk.push({
                  jid: m.sender,
                  query: text,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To download apks use this command *${isPrefix + command} number*\n`
            p += `*Example* : ${isPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i+1}*. ${v.name}\n`
               p += `◦ *Size* : ${v.size} – Version : ${v.version}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = global.apk.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > global.timer) {
               Func.removeItem(global.apk, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   restrict: true
}