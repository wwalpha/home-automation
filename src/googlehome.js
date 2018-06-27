const googlehome = require('google-home-notifier');

googlehome.ip('172.16.80.3', 'ja');

const send = url => googlehome.play(url, (res) => {
  console.log(res);
});

module.exports = {
  send,
};
