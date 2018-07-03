
export interface Storage {
  push(key: string, value: any): Promise<any>;
  set(key: string, value: any): Promise<any>;
  remove(key: string): Promise<any>;
  update(key: string, value: any): Promise<any>;
}