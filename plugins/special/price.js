exports.run = {
   usage: ['premium'],
   category: 'special',
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, `🏷️ Mise à niveau vers le plan premium uniquement 150 gdes,- pour obtenir des limites de 1K pendant 1 mois.\n\nIfvous souhaitez acheter, contactez *${isPrefix}owner*`, m)
   },
   error: false,
   cache: true,
   location: __filename
}