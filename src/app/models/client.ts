import {Task} from './task';
import {Application} from './application';
import {Ufile} from './ufile';
import {Social} from './social';
import {Address} from './address';

export class Client {
  constructor(
    public id: number = null,
    public name: string = '',
    public surname: string = '',
    public phone: string = '',
    public email: string = '',
    public address: Address = null,
    public tasks: Task[] = [],
    public applications: Application[] = [],
    public comments: Comment[] = [],
    public files: Ufile[] = [],
    public socials: Social[] = [],
  ) {
  }
}
