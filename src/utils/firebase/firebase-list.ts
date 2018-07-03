import { firebaseDb } from './firebase';

export default class FirebaseList {
  actions: string;
  modelClass: string;
  path: string;

  constructor(actions: string, modelClass: string, path: string) {
    this.actions = actions;
    this.modelClass = modelClass;
    this.path = path;
  }

  push = (value: string) => new Promise((resolve, reject) => {
    firebaseDb.ref(this.path)
      .push(value, error => (error ? reject(error) : resolve()));
  })

  remove = (key: string) => new Promise((resolve, reject) => {
    firebaseDb.ref(`${this.path}/${key}`)
      .remove(error => (error ? reject(error) : resolve()));
  })

  set = (key: string, value: any) => new Promise((resolve, reject) => {
    firebaseDb.ref(`${this.path}/${key}`)
      .set(value, error => (error ? reject(error) : resolve()));
  })

  update = (key: string, value: any) => new Promise((resolve, reject) => {
    firebaseDb.ref(`${this.path}/${key}`)
      .update(value, error => (error ? reject(error) : resolve()));
  })

  // subscribe = (emit: any) => {
  //   const ref = firebaseDb.ref(this.path);
  //   let initialized = false;
  //   const list: Array<string> = [];

  //   ref.once('value', () => {
  //     initialized = true;
  //     emit(this.actions.onLoad(list));
  //   });

  //   ref.on('child_added', (snapshot) => {
  //     if (initialized) {
  //       emit(this.actions.onAdd(this.unwrapSnapshot(snapshot)));
  //     } else {
  //       list.push(this.unwrapSnapshot(snapshot));
  //     }
  //   });

  //   ref.on('child_changed', (snapshot) => {
  //     emit(this.actions.onChange(this.unwrapSnapshot(snapshot)));
  //   });

  //   ref.on('child_removed', (snapshot) => {
  //     emit(this.actions.onRemove(this.unwrapSnapshot(snapshot)));
  //   });

  //   this.unsubscribe = () => ref.off();
  // }

  unsubscribe() {
    this.unsubscribe();
  }

  unwrapSnapshot(snapshot: firebase.database.DataSnapshot | null) {
    if (!snapshot) return;

    const attrs = snapshot.val();
    attrs.key = snapshot.key;
    // return new this.ModelClass(attrs);
  }
}
