import {Application} from './application';
import {Ufile} from './ufile';

export class Contract {
  constructor(
    public id: number = null,
    public date: string = '',
    public application: Application = null,
    public applicationId: number = null,
    public files: Ufile[] = []
  ) {
  }
}
