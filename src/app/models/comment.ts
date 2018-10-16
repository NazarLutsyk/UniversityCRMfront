import {Client} from './client';

export class Comment {
  constructor(
    public id: number = null,
    public text: string = '',
    public date: string = '',
    public client: Client = null
  ) {
  }
}
