import {Application} from './application';
import {Group} from './group';

export class Course {
  constructor(
    public id: number = null,
    public name: string = '',
    public applications: Application[] = [],
    public groups: Group[] = []
  ) {
  }
}
