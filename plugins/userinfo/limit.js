exports.run = {
   usage: ['limit'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix,
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      if (user.limit < 1) return client.reply(m.chat, `🚩 Votre utilisation du bot a atteint la limite et sera réinitialisée à 00h00\n\nPour obtenir plus de limites, passez à un envoi premium *${isPrefix}premium*`, m)
      client.reply(m.chat, `🍟 Your limit : [ *${Func.formatNumber(user.limit)}* ]${!user.premium ? `\n\nPour obtenir plus de limites, passez à un envoi premium*${isPrefix}premium*` : ''}`, m)
   },
   error: false
}