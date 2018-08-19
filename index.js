const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'chatbot'
})

//start handler
// bot.on('start', () => {
//   var params = {
//     icon_emoji: ':smiley:'
//   }
// // bot.getUsers()
// // .then(response => {
// //   console.log(response);
// // })
//   bot.postMessageToUser('theangelaluo', 'Hi! I am ChatBot.', params);
// });

//error handler
bot.on('error', (err) => console.log(err));

//message handler
bot.on('message', (data) => {
  if (data.type !== 'message') {
    return;
  } else {
    var user = data.user;
    bot.getUsers()
    .then(response => {
      for (var i = 0; i < response.members.length; i++) {
        if (response.members[i].id === user) {
          return response.members[i].name
        }
      }
    })
    .then(name => {
      var params = {
        icon_emoji: ':smiley:'
      }
      if (data.text.includes('joke')) {
        joke(name);
      } else if (data.text.includes('advice')) {
        advice(name);
      } else if (data.text.includes('quote')) {
        quote(name);
      } else if (data.text.includes('help')) {
        params = {
          icon_emoji: ':no_mouth:'
        }
        bot.postMessageToUser(name, "Type 'joke', 'quote', 'advice', or 'random' to interact with ChatBot.", params);
      } else if (data.text.includes('random')) {
        var num = Math.floor(Math.random() * 3) + 1;
        if (num === 1) {
          joke(name);
        } else if (num === 2) {
          advice(name);
        } else {
          quote(name);
        }
      } else {
        bot.postMessageToUser(name, "Hi, I am ChatBot. Would you like to hear a joke, a quote, or some advice?", params);
      }

    });

  }
})

function joke(name) {
  axios({
    method: 'get',
    url: 'https://icanhazdadjoke.com/',
    headers: {
      "Accept": "application/json"
    }
  })
  .then(response => {
    const joke = response.data.joke
    var params = {
      icon_emoji: ':rolling_on_the_floor_laughing:'
    }
    bot.postMessageToUser(name, "Here's a joke: " + joke, params);
  })
}

function advice(name) {
  axios({
    method: 'get',
    url: 'http://api.adviceslip.com/advice',
    headers: {
      "Content-Type":"application/json"
    },
  })
  .then(response => {
    const advice = response.data.slip.advice;
    var params = {
      icon_emoji: ':thinking_face:'
    }
    bot.postMessageToUser(name, "Here's some advice: " + advice, params);
  })
}

function quote(name) {
  axios({
    method: 'get',
    url: 'https://talaikis.com/api/quotes/random/'
  })
  .then(response => {
    var quote = response.data.quote;
    var params = {
      icon_emoji: ':face_with_monocle:'
    }
    bot.postMessageToUser(name, "Here's a quote: " + quote, params);
  })
}
