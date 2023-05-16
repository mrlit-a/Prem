exports.run = {
   usage: ['point'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      if (user.point < 1) return client.reply(m.chat, `🚩 You don't have points, to get points send *${isPrefix}claim*`, m)
      client.reply(m.chat, Func.texted('bold', `🚩 You have ${Func.h2k(user.point)} (${Func.formatNumber(user.point)}) points.`), m)
   },
   error: false
}