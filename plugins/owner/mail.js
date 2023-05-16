const nodemailer = require('nodemailer')
const fs = require('fs')
exports.run = {
   usage: ['mail'],
   use: 'to | subject | message',
   category: 'owner',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'to | subject | message'), m)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         client.sendReact(m.chat, '🕒', m.key)
         let [to, subject, msg] = text.split`|`
         if (!to || !subject || !msg) return client.reply(m.chat, Func.example(isPrefix, command, 'to | subject | message'), m)
         const transport = nodemailer.createTransport({
            service: process.env.USER_EMAIL_PROVIDER,
            auth: {
               user: process.env.USER_EMAIL,
               pass: process.env.USER_APP_PASSWORD
            }
         })
         if (!mime) {
            const mailOptions = {
               from: {
                  name: process.env.USER_NAME,
                  address: process.env.USER_EMAIL
               },
               to: to.trim(),
               subject: subject.trim(),
               text: msg.trim()
            }
            transport.sendMail(mailOptions, function(err, data) {
               if (err) return m.reply(Func.jsonFormat(err))
               client.reply(m.chat, `🚩 ${data.response}`, m)
            })
         } else {
            let json = await Func.getFile(await q.download())
            const mailOptions = {
               from: {
                  name: process.env.USER_EMAIL,
                  address: process.env.USER_EMAIL
               },
               to: to.trim(),
               subject: subject.trim(),
               html: `<div style="padding:20px;border:1px dashed #222;font-size:15px"><tt>Hi <b>${m.pushName} 😘</b><br><br>${msg.trim()}<br><br><hr style="border:0px; border-top:1px dashed #222"><br>Regards, <b>Wildan Izzudin</b></tt></div>`,
               attachments: [{
                  filename: json.filename,
                  content: fs.createReadStream(json.file)
               }]
            }
            transport.sendMail(mailOptions, function(err, data) {
               if (err) return m.reply(Func.jsonFormat(err))
               client.reply(m.chat, `🚩 ${data.response}`, m)
            })
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   cache: true,
   location: __filename
}