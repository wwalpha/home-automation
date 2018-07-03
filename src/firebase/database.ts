import { firebaseDb } from './firebase';

firebaseDb.ref().on('child_added', (snapshop: firebase.database.DataSnapshot) => {
  console.log(snapshop);
});

export const push = (key: string, value: any): Promise<void> => new Promise((resolve, reject) => {
  firebaseDb.ref(key).push(value, error => (error ? reject(error) : resolve()));
});

export const set = (key: string, value: any): Promise<void> => new Promise((resolve, reject) => {
  firebaseDb.ref(key).set(value, error => (error ? reject(error) : resolve()));
});

export const remove = (key: string, value: any): Promise<void> => new Promise((resolve, reject) => {
  firebaseDb.ref(key).remove(error => (error ? reject(error) : resolve()));
});

export const update = (key: string, value: any): Promise<void> => new Promise((resolve, reject) => {
  firebaseDb.ref(key).update(value, error => (error ? reject(error) : resolve()));
});
