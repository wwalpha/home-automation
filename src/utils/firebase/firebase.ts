import * as Firebase from 'firebase';
import FirebaseConfig from './config';

import 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

export const firebaseApp = Firebase.initializeApp(FirebaseConfig);
export const firebaseAuth = Firebase.auth();
export const firebaseDb = Firebase.database();
export const storage = Firebase.storage();
