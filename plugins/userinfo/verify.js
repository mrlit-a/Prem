const nodemailer = require('nodemailer')
exports.run = {
   usage: ['reg'],
   use: 'email',
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (global.db.users.find(v => v.jid == m.sender).verified) return client.reply(m.chat, Func.texted('bold', `✅ Your number already verified.`), m)
      if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'andysebastien14@gmail.com'), m)
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig.test(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Invalid email.'), m)
      let emails = global.db.users.filter(v => v.email).map(v => v.email)
      if (emails.includes(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Email already registered.'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let code = `${Func.randomInt(100, 900)}-${Func.randomInt(100, 900)}`
      let users = global.db.users.find(v => v.jid == m.sender)
      users.codeExpire = new Date * 1
      users.code = code
      users.email = args[0]
      const transport = nodemailer.createTransport({
         service: process.env.USER_EMAIL_PROVIDER,
         auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_APP_PASSWORD
         }
      })
      const mailOptions = {
         from: {
            name: process.env.USER_NAME,
            address: process.env.USER_EMAIL
         },
         to: args[0],
         subject: 'Email Verification',
         html: `<div style="padding:20px;border:1px dashed #222;font-size:15px"><tt>Bonjour <b>${m.pushName} 😘</b><br><br>Confirmez votre email pour pouvoir utiliser ${process.env.USER_NAME}. Envoyez ce code au bot et il expirera dans 3 minutes.<br><center><h1>${code}</h1></center>Ou copiez et collez l'URL ci-dessous dans votre navigateur : <a href="https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}">https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}</a><br><br><hr style="border:0px; border-top:1px dashed #222"><br>Regards, <b>${global.owner_name}</b></tt></div>`
      }
      transport.sendMail(mailOptions, function(err, data) {
         if (err) return m.reply(Func.texted('bold', `❌ SMTP Error !!`))
         return client.reply(m.chat, Func.texted('bold', `✅ Vérifiez votre boîte Mail pour obtenir un code de vérification.`), m)
      })
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   private: true
}