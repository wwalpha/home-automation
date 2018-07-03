import { firebaseDb } from './src/firebase/firebase';
import * as moment from 'moment';
import * as home from './src/googlehome';

const query: firebase.database.Query = firebaseDb.ref('messages').orderByChild('timestamp');

query.startAt(moment().utc().format()).on('child_added', (snapshot: firebase.database.DataSnapshot) => {
  const wavpath: string = snapshot.child('wav').val();

  home.send(wavpath);
});
