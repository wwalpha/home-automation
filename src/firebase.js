const firebase = require('firebase');
const config = require('./firebase.config');

const app = firebase.initializeApp(config, 'name');

const provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/plus.login');

app.auth().signInWithPopup(provider).then((result) => {
  console.log(result);

  // const token = result.credential.accessToken;
}).catch(err => console.error(err));

app.database.ref('/').on('value', (snapshot) => {
  console.log(snapshot);
});

module.exports = app;
