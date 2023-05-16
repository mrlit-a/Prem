const Replicate = require('replicate')
exports.run = {
   usage: ['whisper'],
   use: 'reply audio',
   category: 'converter',
   async: async (m, {
      client,
      isPrefix,
      command
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         if (!/audio/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 This feature only for audio.`), m)
         let filesize = typeof q.fileLength == 'undefined' ? q.msg.fileLength.low : q.fileLength.low
         let chSize = Func.sizeLimit(await Func.getSize(filesize), 1) // to avoid error don't change this size
         if (chSize.oversize) return client.reply(m.chat, Func.texted('bold', `🚩 File size cannot be more than 1MB.`), m)
         client.sendReact(m.chat, '🕒', m.key)
         const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN
         })
         const temp = await scrap.uploadImageV2(await q.download())
         if (!temp) return m.reply(Func.jsonFormat(temp))
         const json = await replicate.run('openai/whisper:e39e354773466b955265e969568deb7da217804d8e771ea8c9cd0cef6591f8bc', {
            input: {
               audio: temp.data.url
            }
         })
         if (!json.transcription) return m.reply(global.status.error)
         m.reply(json.transcription.trim())
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}