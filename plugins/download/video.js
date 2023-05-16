const axios = require('axios')
exports.run = {
   usage: ['video'],
   hidden: ['playvid', 'playvideo'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.video(text)
         if (!json.status || !json.data.url) return client.reply(m.chat, global.status.fail, m)
         let caption = `乂  *Y T - V I D E O*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
         caption += `	◦  *Size* : ${json.data.size}\n`
         caption += `	◦  *Duration* : ${json.duration}\n`
         caption += `	◦  *Quality* : ${json.data.quality}\n\n`
         caption += global.footer
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(json.data.url)).data.url}`, m)
         const result = await Func.getFile(await (await axios.get(json.data.url, {
            responseType: 'arraybuffer',
            headers: {
               referer: 'https://y2mate.com'
            }
         })).data)
         let isSize = (json.data.size).replace(/MB/g, '').trim()
         if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.thumbnail)
         }).then(async () => {
            await client.sendFile(m.chat, './' + result.file, json.data.filename, caption, m, {
               document: true
            })
         })
         client.sendFile(m.chat, './' + result.file, json.data.filename, caption, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   premium: true,
   cache: true,
   location: __filename
}