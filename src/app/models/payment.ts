import {Application} from './application';
import {Ufile} from './ufile';

export class Payment {
  constructor(
    public id: number = null,
    public number: string = '',
    public expectedDate: string = '',
    public paymentDate: string = '',
    public amount: number = 0,
    public expectedAmount: number = 0,
    public application: Application = null,
    public applicationId: number = null,
    public paymentStatusId: number = null,
    public files: Ufile[] = []
  ) {
  }
}
