exports.run = {
   async: async (m, {
      client,
      groupSet,
      store
   }) => {
      try {
         if (groupSet.antidelete && m.msg && m.msg.type == 0) {
            const copy = await client.deleteObj(m, client, store)
            if (copy) {
               client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/remove.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(async () => {
                  await client.copyNForward(m.chat, copy)
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   cache: true,
   location: __filename
}