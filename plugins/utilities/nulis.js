const BigBossGenerator = require('lib/generator/BigBoss')
exports.run = {
   usage: ['nulis'],
   use: 'text',
   category: 'utilities',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'ini bapack budi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let Generator = new BigBossGenerator({
            font: 'arch',
            color: 'black',
            size: 19
         })
         Generator.image = 'book'
         await Generator.loadImage()
         await Generator.write(text)
         const image = await Generator.buffers[0]
         client.sendFile(m.chat, image, 'image.jpg', `🍟 *Processed* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}