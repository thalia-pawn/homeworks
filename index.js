#!/usr/bin/env node
const http = require("http");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { API_KEY } = require('./config.js')

function getWeather(city, callback) {
  http
    .get(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`, res => {
      res.setEncoding('utf8');
      let rawData = '';
      
      res.on('data', chunk => {
        rawData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          
          if (parsedData?.success === false) {
            callback(new Error(`${parsedData?.error?.info} (Code: ${parsedData?.error?.code})`));
          } else {
            callback(null, parsedData.current.temperature);
          }
        } catch (error) {
          callback(new Error('Error during parsing response'));
        }
      });
    })
    .on('error', err => {
      callback(err);
    });
}

yargs(hideBin(process.argv))
  .command(
    '$0 <city>',
    'Show current temperature in city',
    yargs => {
      return yargs.positional('city', {
        describe: 'City name',
        type: 'string'
      });
    },
    argv => {
      getWeather(argv.city, (error, temperature) => {
        if (error) {
          console.error('Error:', error.message);
          process.exit(1);
        } else {
          console.log(`Current temperature in ${argv.city.toUpperCase()}: ${temperature}°C`);
          process.exit(0);
        }
      });
    }
  )
  .argv;
