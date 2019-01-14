import {Application} from './application';
import {Ufile} from './ufile';

export class AudioCall {
  constructor(
    public id: number = null,
    public date: string = '',
    public comment: string = '',
    public application: Application = null,
    public applicationId: number = null,
    public files: Ufile[] = []
  ) {
  }
}
