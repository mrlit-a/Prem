exports.run = {
   usage: ['limit'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix,
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      if (user.limit < 1) return client.reply(m.chat, `🚩 Limit ou a rive ou pap ka utilize bot la jodia anko retounen demen anko\n\nSiw bezwen limit ilimite just ekri *${isPrefix}premium*`, m)
      client.reply(m.chat, `🍟 Your limit : [ *${Func.formatNumber(user.limit)}* ]${!user.premium ? `\n\nPour obtenir plus de limites, passez à un envoi premium*${isPrefix}premium*` : ''}`, m)
   },
   error: false
}