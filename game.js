#!/usr/bin/env node
const { createInterface } = require("node:readline");
const { createWriteStream } = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

/*
Задание 1

Написать консольную игру «Орёл или решка»:

    игра загадывает случайное число (1 или 2) и предлагает пользователю угадывать его,
    в качестве аргументов программа принимает на вход имя файла для логирования результатов каждой партии,
    лог-файл может быть представлен в виде любой структуры данных.

*/
const log = (function() {
  let num = 1;
  return function(msg, gameNumber, isUserWon) {
    return (
      JSON.stringify({
        gameNumber,
        id: num++,
        isUserWon,
        userInput: msg,
        date: new Date().toISOString()
      }) + "\n"
    );
  };
})();

function closeProcess(exitCode = 0) {
  console.log("Жаль, что уже уходишь");
  process.exit(exitCode);
}

function getNumber() {
  let current = Math.round(Math.random() + 1);
    return {
    getCurrent: function() {
      return current;
    },
    generateNew: function() {
      current = Math.round(Math.random() + 1);
      return current;
    }
  };
}

function getGameNumber() {
  let current = 1;
    return {
    getCurrent: function() {
      return current;
    },
    generateNew: function() {
      return current++;
    }
  };
}

yargs(hideBin(process.argv)).command(
  "logFile [filePath]",
  "log data to file",
  yargs => {
    return yargs.positional("filePath", {
      describe: "filePath to log",
      default: "logs.txt"
    });
  },
  argv => {
    const writerSrt = createWriteStream(argv.filePath);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt:
        "Загадано чиcло 1 или 2 \nДля выхода из игры используй комбинацию CTRL + C или введи слово 'exit'\n"
    });

    rl.prompt();

    const guessedNumber = getNumber();
    const gameNumber = getGameNumber();
    rl
      .on("line", line => {
        if (line.toLowerCase() === "exit") closeProcess();
        const n = Number(line.trim());
        if (isNaN(n) || line.trim().length === 0 || n > 2 || n < 1) {
          writerSrt.write(log(line, gameNumber.getCurrent()), "UTF8");
          console.log(
            "Вводить можно только числа 1 или 2 ! \nПопробуй еще раз :)"
          );
        } else {
            if (n != guessedNumber.getCurrent()) {
              writerSrt.write(log(line, gameNumber.generateNew(), false), "UTF8");
              console.log("Не угадал. Загадано новое число.");
              guessedNumber.generateNew()
              ;
            } else {
              writerSrt.write(log(line, gameNumber.generateNew(), true), "UTF8");
              console.log("Угадал! Загадано новое число.");
              guessedNumber.generateNew();
            }
        }
      })
      .on("SIGINT", () => {
        closeProcess();
      })
      .on("close", () => {
        closeProcess();
      })
      .on("error", error => {
        console.error(error);
      });
  }
).argv;