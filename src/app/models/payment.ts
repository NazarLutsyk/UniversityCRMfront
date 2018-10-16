import {Application} from './application';

export class Payment {
  constructor(
    public id: number = null,
    public number: string = '',
    public date: string = '',
    public amount: number = 0,
    public file: string = '',
    public application: Application = null
  ) {
  }
}
