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
          const ch={chat:msg.chat.id};
          fetch('https://buben-sha.herokuapp.com/api/ufront/records/member/'+id ,
            {
              method: "PUT",
              body: JSON.stringify(ch),


              headers: {
                'x-apikey': 'today',

              }
            }
          ).then(r=>r.json())
            .then(p=>{



              bot.sendMessage(msg.chat.id,'Привет <b>'+name+'</b><tg-emoji emoji-id="5368324170671202286"></tg-emoji>',{parse_mode:"HTML"}).then(() => {
                // reply sent!
              });

            });
          bot.sendMessage(msg.chat.id, 'Hello, ' + name +'!').then(() => {
            // reply sent!
          });
        }else{
          const usn = msg.from.username ? msg.from.username : 'u_'+msg.from.id;
          const ch={name:usn,upfront:'tele',chat:msg.chat.id};
          fetch('https://buben-sha.herokuapp.com/api/ufront/records/member' ,
            {
              method: "POST",
              body: JSON.stringify(ch),


              headers: {
                'x-apikey': 'today',

              }
            }
          ).then(r=>r.json()).then(
            p=>{
              let page=' ';
              Object.keys(p).forEach(cc => {
                page +=cc+' '+p[cc]+'; ';

              })

              bot.sendMessage(msg.chat.id, 'Hello, ' + JSON.stringify(ch) +'!').then(() => {
                // reply sent!
              });


            }

          )


        }




      }


   )


});

module.exports = bot;
