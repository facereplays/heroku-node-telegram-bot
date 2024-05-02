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
        if(u.records.length>0){
          const id=u.records[0].id;
          fetch('https://buben-sha.herokuapp.com/api/ufront/records/member/'+id ,
            {
              method: "PUT",
              body: "{chat:"+msg.chat.id+"}",


              headers: {
                'x-apikey': 'today',

              }
            }
          ).then(r=>r.json())
            .then(p=>{
              bot.sendMessage(msg.chat.id, p.toString()).then(() => {
                // reply sent!
              });

            });
          bot.sendMessage(msg.chat.id, 'Hello, ' + name + ' '+u.records.length+'!').then(() => {
            // reply sent!
          });
        }else{



        }




      }


   )


});

module.exports = bot;
