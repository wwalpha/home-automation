const Bravia = require('./bravia');

const bravia = new Bravia();
let deferred;

if (process.argv[2] === 'playing') {
  deferred = bravia.getPlayingContentInfo();
} else if (process.argv[2] === 'apps') {
  deferred = bravia.getApplicationList();
} else if (process.argv[2] === 'volume') {
  deferred = bravia.getVolumeInformation();
} else if (process.argv[2] === 'display') {
  deferred = bravia.getPowerSavingMode();
} else {
  console.log(333);
  deferred = bravia.getPowerStatus();
}

deferred.then((response) => {
  console.log(response);
}, (error) => {
  console.log(error);
});
