exports.run = {
   usage: ['premium'],
   category: 'special',
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, `🏷️ siw bezwen achte plan premium lan wap bezwen 250gdes pou on mois.\n\nIfvous souhaitez acheter, taper *${isPrefix}owner*`, m)
   },
   error: false,
   cache: true,
   location: __filename
}