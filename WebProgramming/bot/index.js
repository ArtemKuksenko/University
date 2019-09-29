//https://habr.com/ru/sandbox/115246/ - как запустить бота
// Подключаем библиотеку для работы с Telegram API в переменную
var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот
var token = '649101019:AAG3MkoP_U0XsQ9qCqB4YGCNCcrP0RWU0bI';
// Включить опрос сервера. Бот должен обращаться к серверу Telegram, чтобы получать актуальную информацию
// Подробнее: https://core.telegram.org/bots/api#getupdates
var bot = new TelegramBot(token, {
    polling: true,
    request: {
        proxy: "http://localhost:8118"
//        strictSSL: false
    }
});

// Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием, то есть "Hello World!")
bot.onText(/\/echo (.+)/, function (msg, match) {
console.log('echo')
    var fromId = msg.from.id; // Получаем ID отправителя
    var resp = match[1]; // Получаем текст после /echo
    bot.sendMessage(fromId, resp);
});

// Простая команда без параметров
bot.on('message', function (msg) {
console.log('echo')
    var chatId = msg.chat.id; // Берем ID чата (не отправителя)
    // Фотография может быть: путь к файлу, поток (stream) или параметр file_id
    var photo = 'cat.jpeg'; // в папке с ботом должен быть файл "cats.png"
    bot.sendPhoto(chatId, photo, { caption: 'Милые котята' });
});