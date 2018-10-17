import {Application} from './application';

export class AudioCall {
  constructor(
    public id: number = null,
    public date: string = '',
    public comment: string = '',
    public file: string = '',
    public application: Application = null,
    public applicationId: number = null
  ) {
  }
}
