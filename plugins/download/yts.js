const yts = require('yt-search')
const axios = require('axios')
exports.run = {
   usage: ['ytsearch'],
   hidden: ['yts', 'ytfind', 'mp3', 'mp4'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         global.yts = global.yts ? global.yts : []
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         const check = global.yts.find(v => v.jid == m.sender)
         if (/mp3|mp4/.test(command) && !check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (/mp3|mp4/.test(command) && check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Func.fetchJson('https://neoxr.cyclic.app/api/fetch?url=' + check.results[Number(text) - 1] + '&type=' + (command == 'mp4' ? 'video' : 'audio') + '&quality=' + (command == 'mp4' ? '480p' : '128kbps'))
            if (!json.status || !json.data.url) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (json.data.extension == 'mp3') {
               let caption = `乂  *Y T - P L A Y*\n\n`
               caption += `	◦  *Title* : ${json.title}\n`
               caption += `	◦  *Size* : ${json.data.size}\n`
               caption += `	◦  *Duration* : ${json.duration}\n`
               caption += `	◦  *Bitrate* : ${json.data.quality}\n\n`
               caption += global.footer
               let chSize = Func.sizeLimit(json.data.size, global.max_upload)
               if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(json.data.url)).data.url}`, m)
               client.sendMessageModify(m.chat, caption, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer(json.thumbnail)
               }).then(async () => {
                  const result = await Func.getFile(await (await axios.get(json.data.url, {
                     responseType: 'arraybuffer',
                     headers: {
                        referer: 'https://y2mate.com'
                     }
                  })).data)
                  client.sendFile(m.chat, './' + result.file, json.data.filename, '', m, {
                     document: true,
                     APIC: await Func.fetchBuffer(json.thumbnail)
                  })
               })
            } else if (json.data.extension == 'mp4') {
               let caption = `乂  *Y T - M P 4*\n\n`
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
               }).then(async () => await client.sendFile(m.chat, './' + result.file, json.data.filename, '', m, {
                  document: true
               }))
               client.sendFile(m.chat, './' + result.file, json.data.filename, caption, m)
            } else m.reply(Func.jsonFormat(json))
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await (await yts(text)).all
            if (!json || json.length < 1) return client.reply(m.chat, global.status.fail, m)
            if (!check) {
               global.yts.push({
                  jid: m.sender,
                  results: json.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.map(v => v.url)
            let p = `To get audio use *${isPrefix}mp3 number* and video use *${isPrefix}mp4 number*\n`
            p += `*Example* : ${isPrefix}mp4 1\n\n`
            json.map((v, i) => {
               p += `*${i+1}*. ${v.title}\n`
               p += `◦ *Duration* : ${v.timestamp}\n`
               p += `◦ *Views* : ${Func.h2k(v.views)}\n`
               p += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = global.yts.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > global.timer) {
               Func.removeItem(global.yts, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   restrict: true,
   cache: true,
   location: __filename
}