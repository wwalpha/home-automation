const path = require('path');
const exec = require('child_process').execSync;
const moment = require('moment');
const home = require('./src/googlehome');

const py = path.resolve('py/query.py');
const host = 'http://172.16.80.208:3000';
const auto = ['0720', '0740', '2030', '2100'];


const today = () => {
  const text = '今日の天気';
  const file = 'response.wav';
  const command = `python ${py} -q ${text} -o wav\\${file}`;

  exec(command);

  home.send(`${host}/${file}`);
};

const tomorrow = () => {
  const text = '明日の天気';
  const file = 'response.wav';
  const command = `python ${py} -q ${text} -o wav\\${file}`;

  exec(command);

  home.send(`${host}/${file}`);
};

const start = () => {
  const now = moment().format('HHmm');
  const next = moment();

  let nextTime = auto.find(item => now < item);

  if (!nextTime) {
    nextTime = auto[0];
    next.add(1, 'day');
  }

  console.log(`next time: ${nextTime}`);
  const hour = Number(nextTime.substr(0, 2));
  const minute = Number(nextTime.substr(2, 2));

  next.hour(hour).minute(minute);

  const timeout = next.diff(moment(), 'milliseconds');
  console.log(`wait for ${timeout}ms exec...`);

  setTimeout(() => {
    if (now > '1800') {
      tomorrow();
    } else {
      today();
    }

    console.log('wait 60s for next start');
    setTimeout(start, 60 * 1000);
  }, timeout);
};

start();
