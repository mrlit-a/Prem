exports.run = {
   usage: ['+hide', '-hide'],
   use: 'category',
   category: 'owner',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      plugins
   }) => {
      let categories = [...new Set(Object.values(Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => prop.run.category))).map(v => v.run.category))]
      if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'downloader'), m)
      if (!categories.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 ${args[0]} category does not exist.`), m)
      if (command == '+hide') {
         if (global.db.setting.hidden.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Category ${args[0]} previously been hidden.`), m)
         global.db.setting.hidden.push(args[0])
         client.reply(m.chat, Func.texted('bold', `🚩 ${args[0]} category successfully hidden.`), m)
      } else if (command == '-hide') {
         if (!global.db.setting.hidden.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 ${args[0]} category does not exist.`), m)
         global.db.setting.hidden.forEach((data, index) => {
            if (data === args[0]) global.db.setting.hidden.splice(index, 1)
         })
         client.reply(m.chat, Func.texted('bold', `🚩 ${args[0]} category has been removed from hidden list.`), m)
      }
   },
   owner: true
}