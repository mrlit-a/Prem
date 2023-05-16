exports.run = {
   usage: ['cerpen'],
   hidden: ['cerpenget'],
   use: 'category',
   category: 'e-perpus',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         global.cerpen = global.cerpen ? global.cerpen : []
         const check = global.cerpen.find(v => v.jid == m.sender)
         if (!check && !isNaN(args[0])) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(args[0])) {
            if (Number(args[0]) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.cerpenFetch(check.results[Number(args[0]) - 1])
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let text = `*${json.data.title.toUpperCase()}*\n`
            text += `by ${json.data.author}\n\n`
            text += json.data.content
            client.reply(m.chat, text, m)
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.cerpenList(args[0])
            if (!json.status && json.category_list) return m.reply(`*Category List* :\n\n${json.category_list.map(v => `- ${Func.ucword(v)}`).join('\n')}`)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               global.cerpen.push({
                  jid: m.sender,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To read cerpen use this command *${isPrefix + command} number*\n`
            p += `*Example* : ${isPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i+1}*. ${v.title}\n`
               p += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = global.cerpen.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > global.timer) {
               Func.removeItem(global.cerpen, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}