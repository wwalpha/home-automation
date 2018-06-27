const readline = require('readline');
const Bravia = require('./bravia');

const bravia = new Bravia('172.16.81.25');

bravia.authenticate().then((cookie) => {
  console.log(3333);
  if (cookie) {
    console.log(cookie);
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Please enter the 4-digit code shown on your TV: ', (code) => {
      bravia.authenticate(code).then((cookie1) => {
        if (cookie1) {
          console.log(cookie1);
        } else {
          console.log('Registration failed');
        }
      }, (error) => {
        console.log(error);
      });

      rl.close();
    });
  }
}, (error) => {
  console.log(error);
});
