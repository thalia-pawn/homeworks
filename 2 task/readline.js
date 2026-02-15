#!/usr/bin/env node
const { createInterface } = require("node:readline");

/*
Необходимо написать утилиту командной строки, которая играет в игру "Загадай число". 
Программа загадывает число и выводит диапазон значений, в пределах которого число было загадано. 
Пользователь набирает числа в стандартный поток ввода и получает ответ больше или меньше, чем загаданное.
*/
const number = Math.round(Math.random() * 100);
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Загадано число в диапазоне от 0 до 100 \n"
});

rl.prompt();

rl
  .on("line", line => {
    const n = Number(line.trim());
    if (isNaN(n) || line.trim().length === 0) {
      console.log("Вводить можно только числа и сам ввод числа обязателен! \nПопробуй еще раз :)");
    } else {
      if (n > 100 || n < 0) {
        console.log("Число должно быть от 0 до 100 ! Попробуй еще раз :)");
      } else {
        if (n < number) {
          console.log("Больше");
        } else if (n > number) {
          console.log("Меньше");
        } else if (n === number) {
          console.log(`Отгадано число ${number}`);
          process.exit(0);
        }
      }
    }
  })
  .on("SIGINT", () => {
    console.log("Жаль, что сдался так быстро");
    process.exit(0);
  })
  .on("close", () => {
    console.log("Жаль, что сдался так быстро");
    process.exit(0);
  });
