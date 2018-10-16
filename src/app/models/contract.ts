import {Application} from './application';

export class Contract {
  constructor(
    public id: number = null,
    public date: string = '',
    public file: string = '',
    public application: Application = null
  ) {
  }
}
