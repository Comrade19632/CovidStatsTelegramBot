const Telegraf = require('telegraf');
const app = new Telegraf(token);

app.hears('hi', ctx => {
    return ctx.reply('Hey!');
});

app.startPolling(()=>{console.log('congrats')});
const axios = require('axios'); // add axios

// handle the reaction everytime user sends a text message
app.on('text', ctx => {
    // ctx object holds the Update object from Telegram API
    // So you can use everything you see there

    // get the text message sent by user
    const country = ctx.message.text;

    // GET the data from Reddit API
    axios
        .get(`https://pomber.github.io/covid19/timeseries.json`)
        .then(res => {
            // data recieved from Reddit
            if (res.data[country] === undefined) return ctx.reply('Вводи названия стран на английском и с большой буквы(Например : US,Russia,Italy)')
            const data = res.data[country][res.data[country].length - 1];


            const ruDateFn = (date) => {
                let [yy, mm, dd] = date.split('-');
                switch (mm) {
                    case '1':
                        mm = 'Января';
                        break;
                    case '2':
                        mm = 'Февраля';
                        break;
                    case '3':
                        mm = 'Марта';
                        break;
                    case '4':
                        mm = 'Апреля';
                        break;
                    case '5':
                        mm = 'Мая';
                        break;
                    case '6':
                        mm = 'Июня';
                        break;
                    case '7':
                        mm = 'Июля';
                        break;
                    case '8':
                        mm = 'Августа';
                        break;
                    default:
                }
                return `${dd} ${mm} ${yy}г.`;
            };
            let date = ruDateFn(data['date']);
            return ctx.reply(`Дата: ${date}
Зараженные: ${data['confirmed']}
Погибшие: ${data['deaths']}
Выздоровевшие: ${data['recovered']}
`);

        })

        // if there's any error in request
        .catch(err => console.log(err));
});