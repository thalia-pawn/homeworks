#!/usr/bin/env node
const { createReadStream } = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

/*
Задание 2

Написать программу-анализатор игровых логов. В качестве аргумента программа получает путь к файлу логов из задания 1.

По результатам анализа программа выводит в консоль следующие данные:

    общее количество партий,
    количество выигранных/проигранных партий,
    процентное соотношение выигранных партий.


*/
function setGameResultCount() {
  let won = 0;
  return {
    setCount: function(status) {
      if (status) {
        won++;
      }
    },
    getCount: function() {
      return won;
    }
  };
}
const gamesCount = setGameResultCount();

yargs(hideBin(process.argv)).command(
  "logFile [filePath]",
  "analyse log data",
  yargs => {
    return yargs.positional("filePath", {
      describe: "filePath to log file",
      default: "logs.txt"
    });
  },
  argv => {
    let result = {};
    const stream = createReadStream(argv.filePath, "utf8");
    stream.on("data", chunk => {
      const lines = chunk.split("\n");
      lines.map(d => {
        try {
          const data = JSON.parse(d);
          result.totalCount = data.gameNumber;
          gamesCount.setCount(data.isUserWon);
        } catch (error) {
          return "ERROR_DATA";
        }
      });
    });
    stream.on("error", error => {
      console.log(error.message);
    });
    stream.on("end", () => {
      const won = gamesCount.getCount();
      console.log(
        "Общее количество партий: " + result.totalCount + "\n",
        "Количество выигранных партий: " + won + "\n",
        "Количество проигранных партий: " + (result.totalCount - won) + "\n",
        "Процентное соотношение выигранных партий: " +
          (won / result.totalCount * 100).toFixed(2) +
          "%"
      );
    });
  }
).argv;
