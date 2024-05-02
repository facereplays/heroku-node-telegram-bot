const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('message', (msg) => {
  const name = msg.from.first_name;
   fetch('https://buben-sha.herokuapp.com/api/records/member/?filter=name,eq,' + msg.from.username)
    .then(response => response.json()).then(
      u=>{


        bot.sendMessage(msg.chat.id, 'Hello, ' + name + ' '+u.records.length+'!').then(() => {
          // reply sent!
        });

      }


   )


});

module.exports = bot;
