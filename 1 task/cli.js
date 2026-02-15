#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const currentDate = new Date();
yargs(hideBin(process.argv))
  // Команда current
  .command(
    "current",
    "Get current date",
    yargs => {
      return yargs
        .option("year", {
          alias: "y",
          type: "boolean",
          description: "Get current year"
        })
        .option("month", {
          alias: "m",
          type: "boolean",
          description: "Get current month"
        })
        .option("date", {
          alias: "d",
          type: "boolean",
          description: "Get current date"
        });
    },
    argv => {
      if (argv.year) {
        console.log(currentDate.getFullYear());
      } else if (argv.month) {
        console.log(currentDate.getMonth() + 1);
      } else if (argv.date) {
        console.log(currentDate.getDate());
      } else {
        console.log(currentDate);
      }
    }
  )
  // Команда add
  .command(
    "add",
    "Add values to current date",
    yargs => {
      return yargs
        .option("year", {
          alias: "y",
          type: "number",
          description: "Years to add"
        })
        .option("month", {
          alias: "m",
          type: "number",
          description: "Months to add"
        })
        .option("date", {
          alias: "d",
          type: "number",
          description: "Days to add"
        });
    },
    argv => {
      currentDate.setFullYear(currentDate.getFullYear() + (argv.year || 0));
      currentDate.setMonth(currentDate.getMonth() + (argv.month || 0));
      currentDate.setDate(currentDate.getDate() + (argv.date || 0));

      console.log(currentDate);
    }
  )
  // Команда sub
  .command(
    "sub",
    "Subtract values from current date",
    yargs => {
      return yargs
        .option("year", {
          alias: "y",
          type: "number",
          description: "Years to subtract"
        })
        .option("month", {
          alias: "m",
          type: "number",
          description: "Months to subtract"
        })
        .option("date", {
          alias: "d",
          type: "number",
          description: "Days to subtract"
        });
    },
    argv => {
      currentDate.setFullYear(currentDate.getFullYear() - (argv.year || 0));
      currentDate.setMonth(currentDate.getMonth() - (argv.month || 0));
      currentDate.setDate(currentDate.getDate() - (argv.date || 0));

      console.log(currentDate);
    }
  )
  .demandCommand(1, "You need to specify a command: current, add or sub")
  .help().argv;
