import {Client} from './client';

export class Social {
  constructor(
    public id: number = null,
    public url: string = '',
    public clientId: number = null,
    public client: Client = null,
  ) {
  }
}
