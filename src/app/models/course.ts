import {Application} from './application';
import {Group} from './group';

export class Course {
  constructor(
    public id: number = null,
    public name: string = '',
    public discount: number = 0,
    public resultPrice: number = 0,
    public fullPrice: number = 0,
    public applications: Application[] = [],
    public groups: Group[] = []
  ) {
  }
}
