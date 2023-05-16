exports.run = {
   usage: ['claim'],
   category: 'user info',
   async: async (m, {
      client
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      let timeClaim = 3600000
      let claimed = new Date(user.lastclaim + timeClaim)
      let timeout = claimed - new Date()
      let point = Func.randomInt(1, 5000)
      if (new Date - user.lastclaim > timeClaim) {
         client.reply(m.chat, Func.texted('bold', `🎉 Congratulations!, you got +${Func.formatNumber(point)} points.`), m)
         user.point += point
         user.lastclaim = new Date() * 1
      } else {
         client.reply(m.chat, `*You have claimed, you can reclaim in the next hour.*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
      }
   },
   error: false
}