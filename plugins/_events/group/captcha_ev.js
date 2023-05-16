exports.run = {
   async: async (m, {
      client,
      body,
      groupSet,
      isBotAdmin
   }) => {
      try {
         if (!isBotAdmin) groupSet.captcha = false
         global.db.captcha = global.db.captcha ? global.db.captcha : {}
         let room = Object.values(global.db.captcha).find(room => room.to == m.sender && room.groupId == m.chat)
         if (room && body) {
            if (room.code == body) {
               return client.reply(room.groupId, Func.texted('bold', `✅ Successfully verified.`), m).then(() => {
                  clearTimeout(room.timeout)
                  delete global.db.captcha[room.to]
               })
            } else {
               room.wrong += 1
               if (room.wrong >= 3) return await client.reply(room.groupId, Func.texted('bold', `❌ [ 3 / 3 ] your chance is up, goodbye . . .`), m).then(async () => {
                  await Func.delay(1500)
                  client.groupParticipantsUpdate(room.groupId, [room.to], 'remove')
                  clearTimeout(room.timeout)
                  delete global.db.captcha[room.to]
               })
               return client.reply(room.groupId, `❌ Incorrect captcha code, you have *${3 - room.wrong}* more chances.`, m)
            }
         } else {}
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   botAdmin: true,
   cache: true,
   location: __filename
}