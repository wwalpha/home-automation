
export class FirebaseList {
  actions: string;
  modelClass: string;
  path: string;

  static path(): string;

  push: (value: string) => Promise<any>
}