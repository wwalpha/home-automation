import { storage } from './firebase';

export const put = (key: string, value: any) => new Promise((resolve, reject) => {
  console.log(3333);
  const ref = storage.ref(key);
  console.log(ref);
  ref.put(value)
    .then(
      snapshot => resolve(snapshot),
      error => reject(error),
  );
});

// export const set = (key: string, value: any) => new Promise((resolve, reject) => {
//   firebaseDb.ref(key).set(value, error => (error ? reject(error) : resolve()));
// });

// export const remove = (key: string, value: any) => new Promise((resolve, reject) => {
//   firebaseDb.ref(key).remove(error => (error ? reject(error) : resolve()));
// });

// export const update = (key: string, value: any) => new Promise((resolve, reject) => {
//   firebaseDb.ref(key).update(value, error => (error ? reject(error) : resolve()));
// });
