import {Task} from './task';
import {Application} from './application';
import {Ufile} from './ufile';

export class Client {
  constructor(
    public id: number = null,
    public name: string = '',
    public surname: string = '',
    public phone: string = '',
    public email: string = '',
    public tasks: Task[] = [],
    public applications: Application[] = [],
    public comments: Comment[] = [],
    public passports: Ufile[] = []
  ) {
  }
}
