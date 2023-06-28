const { Function, Scraper } = new (require('@neoxr/neoxr-js'))
// Owner number
global.owner = '19146396740'
// Owner name
global.owner_name = 'andy_mr_lit'
// Database name (Default: database)
global.database = 'andydatabase'
// Maximum upload file size limit (Default : 100 MB)
global.max_upload = 100
// Delay for spamming protection (Default : 3 seconds)
global.cooldown = 3
// User Limitation (Default : 25)
global.limit = 5
// Multiplier (the higher the multiplier the harder it is to level up)
global.multiplier = 36
// Min & Max for game reward
global.min_reward = 100000
global.max_reward = 500000
// Time to be temporarily banned and others (Default : 30 minutes)
global.timer = 1800000
// Symbols that are excluded when adding a prefix (Don't change it)
global.evaluate_chars = ['=>', '~>', '<', '>', '$']
// Country code that will be automatically blocked by the system, when sending messages in private chat
global.blocks = ['91', '92', '94', '212']
// Put target jid to forward friends story
global.forwards = global.owner + '@c.us'
// Get neoxr apikey by registering at https://api.neoxr.my.id
global.Api = new (require('./neoxrApi'))(process.env.API_KEY)
// Timezone (Default : Asia/Jakarta)
global.timezone = 'America/Port-au-Prince'
// Bot name
global.botname = `© andymd v${require('package.json').version} (Premium Script)`
// Footer text
global.footer = 'ANDY BOT'
// Scraper
global.ram_usage = 900000000
// ram usage for heroku user by andy
global.scrap = Scraper
// Function
global.Func = Function
// Global status
global.status = Object.freeze({
   wait: Func.texted('bold', 'Processed . . .'),
   invalid: Func.texted('bold', 'URL is Invalid!'),
   wrong: Func.texted('bold', 'Wrong format!'),
   getdata: Func.texted('bold', 'Scraping metadata . . .'),
   fail: Func.texted('bold', 'Can\'t get metadata!'),
   error: Func.texted('bold', 'Error occurred!'),
   errorF: Func.texted('bold', 'Sorry this feature is in error.'),
   auth: Func.texted('bold', 'You do not have permission to use this feature, ask the owner first.'),
   premium: Func.texted('bold', 'This feature only for premium user.'),
   owner: Func.texted('bold', 'This command only for owner.'),
   god: Func.texted('bold', 'This command only for Master'),
   group: Func.texted('bold', 'This command will only work in groups.'),
   botAdmin: Func.texted('bold', 'This command will work when I become an admin.'),
   admin: Func.texted('bold', 'This command only for group admin.'),
   private: Func.texted('bold', 'Use this command in private chat.'),
   gameSystem: Func.texted('bold', 'Game features have been disabled.'),
   gameInGroup: Func.texted('bold', 'Game features have not been activated for this group.'),
   gameLevel: Func.texted('bold', 'You cannot play the game because your level has reached the maximum limit.')
})
