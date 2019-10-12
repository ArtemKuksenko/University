/**
 *  Модуль для взаимодействия бота тех поддержки
 *      обход блокировок: https://habr.com/ru/sandbox/115246/
 *      полезности: https://core.telegram.org/bots/api#getupdates
 */

let TelegramBot = require('node-telegram-bot-api');
const token = '649101019:AAG3MkoP_U0XsQ9qCqB4YGCNCcrP0RWU0bI';
const WebSocket = require('ws');
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true } );

mongoClient.connect(function(err, cur){
    const db = cur.db("SupportDB");
    const collection = db.collection("worker");
});

let wss = new WebSocket.Server({
  port: 8012
});

wss.broadcast = function(data, clientValidator = () => true) {
    this.clients.forEach(client => {
        if (clientValidator(client)) {
            client.send(data);
        }
    });
}

var bot = new TelegramBot(token, {
    polling: true,
    request: {
        proxy: "http://localhost:8118"
    }
});

// var fromId = null;

bot.onText(/\/registrateWorker (.+)/, function (msg, match) {
console.log('start_working')
    let fromId = msg.from.id;

    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

wss.on("connection", ws => {
    ws.on('message', message => {
        console.log('пришло',message);
        bot.sendMessage(fromId,message);
    });
});

// Простая команда без параметров
bot.on('message', function (msg) {
    wss.broadcast(msg.text)
});