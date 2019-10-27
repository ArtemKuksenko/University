/**
 *  Модуль для взаимодействия бота тех поддержки
 *      обход блокировок: https://habr.com/ru/sandbox/115246/
 *      полезности: https://core.telegram.org/bots/api#getupdates
 */
let TelegramBot = require('node-telegram-bot-api');
const token = '649101019:AAG3MkoP_U0XsQ9qCqB4YGCNCcrP0RWU0bI';
const WebSocket = require('ws');
let wss = new WebSocket.Server({
    port: 8034
});

let wsListByWorker = [];
let workerListByWs = [];
const chatBotAdmin = 485915563;

wss.broadcast = function(data, clientValidator = () => true) {

    this.clients.forEach(client => {
        if (clientValidator(client)) {
        client.send(data);
    }
});
}

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/");

mongoClient.connect(async function(err, cur){
    const db = cur.db("SupportDB");
    const collection = db.collection("worker");
    const cycle = db.collection("cycle");

    res = await collection.find().toArray()

    console.log(res)
    var bot = new TelegramBot(token, {
        polling: true,
        request: {
            proxy: "http://localhost:8118"
        }
    });



});
bot.onText(/\/help/,(sender,msg) => {
    bot.sendMessage(sender.from.id,
        "/registration 'псвевдоним' - зарегаться,\n" +
        "/score - счет" +
        "/start - начать работать" +
        "/end - закончить работу" +
        "/leave - покинуть нас")

bot.onText(/\/score()/,async (sender,msg) => {
let res = await collection.findOne({id:sender.from.id},{score: 1})
bot.sendMessage(sender.from.id, "твой счет: "+res.score)
console.log(res)
});

bot.onText(/\/start()/,(sender,msg) => {
collection.update({id:sender.from.id},{$set:{work:true}})
bot.sendMessage(sender.from.id, "жди сообщений )")
});
bot.onText(/\/end()/,(sender,msg) => {
collection.update({id:sender.from.id},{$set:{work:false}})
bot.sendMessage(sender.from.id, "тишина и покой, не будет писем пока")
});

bot.onText(/\/leave()/,async (sender,msg) => {
let res = await collection.remove({id:sender.from.id});
if (res.result.n)
// Простая команда без параметров
    bot.on("message", function (msg) {
        wsListByWorker[msg.from.id].send(msg.text);
    });
bot.sendMessage(sender.from.id, "Пока,\nНадеюсь ты нашел работу по лучше)");
        else
            bot.sendMessage(sender.from.id, "Ты и так не с нами,\nЧто мертво - умереть не может\n(c)Грейджои из замка Пайк");
    });

    bot.onText(/\/registration (.+)/,async function (msg, match) {
        // let fromId = msg.from.id;
        let name = match[1];
        // bot.sendMessage(fromId, name);
        let res = await collection.find({id:fromId}).toArray();
        if (res.length === 0){
            let ins = await collection.insert({id:fromId, name: name,score:0});
            if (ins.result.n)
                bot.sendMessage(fromId,'Привет, ты успешно зарегистрирован )')
        } else {
            bot.sendMessage(fromId, 'Не, ну ты уже и так с нами xD');
        }
    });

    bot.onText(/\/closeDialog()/,async (msg)=> {
        let worker = msg.from.id;
        let ws = wsListByWorker[worker]
        await collection.update({id:worker},{$set:{busy:false}});
        await cycle.remove({id:worker});
        delete workerListByWs[ws];
        delete wsListByWorker[worker];
        ws.close();
    });

    wss.on("connection", ws => {
        console.log('connect');
        ws.on('message', async (message) => {
            let messageText = message;
            message = JSON.parse(message);
            console.log('пришло', messageText);
            if (message.text === undefined) {

                let res = await collection.find({work: true, busy: false}).toArray();
                if (res.length === 0) {
                    bot.sendMessage(chatBotAdmin, 'Нет никого в техподдрежке!');
                    ws.send('Извините, сейчас нет менеджеров онлайн');

                }

            } else {
                let select = await cycle.findOne({token:message.token});
                if (select === null){
                    let res = await collection.find({work: true}).toArray();
                    let worker = res[Math.round( Math.random() * (res.length -1) )].id;
                    console.log('stop')
                    res = await collection.update({id:worker},{$set:{busy:true}});
                    let ins = await cycle.insert({'worker': worker, 'token':message.token});
                    bot.sendMessage(worker, message.text);
                    wsListByWorker[worker] = ws;
                    workerListByWs[ws] = worker;
                }   else
                    bot.sendMessage(select.worker, message.text);
            }

        });


    });
    // closeConnection = async (ws) => {
    //      let worker = workerListByWs[ws];
    //      await collection.update({id:worker},{$set:{busy:false}});
    //      await cycle.remove({id:worker});
    //      delete workerListByWs[ws];
    //      delete wsListByWorker[worker];
    //      ws.close();
    // }
    // wss.on('close', closeConnection(ws));
    // wss.on('disconnect', closeConnection(ws));
    // socket.on('error', function (ws,err) {
    //     console.log(ws)
    // });




});
