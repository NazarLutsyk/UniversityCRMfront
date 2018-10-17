import {Client} from './client';

export class Task {
  constructor(
    public id: number = null,
    public message: string = '',
    public date: string = '',
    public client: Client = null,
    public clientId: number = null
  ) {
  }
}
