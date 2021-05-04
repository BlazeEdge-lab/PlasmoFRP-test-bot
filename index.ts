import * as config from "./config.json"; // Config file
import { names, surnames } from "./names.json"; // Имена и фамилии
import { Client, MessageEmbed } from "discord.js"; // Библиотека
const client = new Client(); // Инициализация экземпляра клиента

const names_count = {
    m: names.m.length,
    f: names.f.length
} // Это подсчёты для того, чтобы при выполнении команды это не делать каждый раз.

const surnames_count = surnames.length;

client.on('ready', () => {
    console.log('Бот запущен...'); // Отправляем в консоль о том, что бот готов к работе
});

client.on("message", async (ctx) => {
    if (ctx.author.bot) return; // Игнорируем ботов
    if (!ctx.content.startsWith(config.prefix)) return; // Игнорируем сообщения без префикса
    const [cmd, ...args] = ctx.content.replace(config.prefix, "").split(" ").map(e => e.trim()); // Получаем команду и аргументы (если их нет - undefined)
    switch (cmd) {
        case "hello": // CMD: hello
            ctx.reply('привет'); // Ответ на команду
            break;
        case "gen": // CMD: gen
            if (args[0] === "name") { // 1 аргумент - name
                if (args[1] != "m" && args[1] != "f") return ctx.reply('введите пол (m - мужчина, f - женщина)'); // Проверка на то, что пользователь ввёл
                const name = names[args[1]][Math.floor(Math.random() * names_count[args[1]])]; // Генерируем случайное имя
                const surname = surnames[Math.floor(Math.random()*surnames_count)]; // Генерируем случайную фамилию
                const embed = new MessageEmbed() // Делаем вложение
                    .setTitle("Сгенерированное имя:") // Заголовок
                    .setDescription(name + " " + surname) // Описание
                    .setColor(0x7FFF00); // Цвет сноски
                ctx.reply("вот что вышло", embed); // Отправляем это всё человеку
            } else if (args[0] === 'random') { // 1 аргумент - random
                // @ts-ignore: не соответствие типов :(
                args[1] = Number(args[1]); // Min
                // @ts-ignore
                args[2] = Number(args[2]); // Max

                if (!args[1] || !args[2]) return ctx.reply('параметры 3 и 4 - это целые числа минимума и максимума'); // Проверка на то, что параметры указаны

                ctx.reply(`случайное число в интервале от ${args[1]} и до ${args[2]}:\n ${getMinMax(args[1], args[2])}`); // Выводим
            }
    }
});

client.login(config.token); // Авторизуем бота

function getMinMax(min, max) { // Функция для рандомного числа из интервала
    min = Math.ceil(min); // Округление в большую сторону
    max = Math.floor(max); // Округление в меньшую сторону
    return Math.floor(Math.random() * (max - min + 1)) + min; // Вычисляем рандом
}