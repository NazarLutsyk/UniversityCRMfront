import {Ufile} from './ufile';
import {Client} from './client';

export class AudioCall {
  constructor(
    public id: number = null,
    public date: string = '',
    public comment: string = '',
    public client: Client = null,
    public clientId: number = null,
    public files: Ufile[] = []
  ) {
  }
}
