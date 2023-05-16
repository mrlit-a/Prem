exports.run = {
   usage: ['blisa', 'sepia', 'eva', 'pencan', 'blackpen', 'solorize', 'warhol', 'gtas', 'scrable', 'glitch', 'dupl', 'messi', 'hell', 'ronaldo', 'fireline', 'bmolly', 'bmilk'],
   use: 'reply foto',
   category: 'effects ii',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               let img = await client.downloadMediaMessage(q)
               let image = await scrap.uploadImage(img)
               let result = Api.ie2(command.toLowerCase(), image.data.url)
               if (!result || result.constructor.name != 'String') return client.reply(m.chat, global.status.fail, m)
               client.sendFile(m.chat, result, ``, `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            let img = await q.download()
            let image = await scrap.uploadImage(img)
            let result = Api.ie2(command.toLowerCase(), image.data.url)
            if (!result || result.constructor.name != 'String') return client.reply(m.chat, global.status.fail, m)
            client.sendFile(m.chat, result, ``, `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true
}