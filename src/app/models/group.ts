import {Application} from './application';
import {Lesson} from './lesson';
import {Course} from './course';

export class Group {
  constructor(
    public id: number = null,
    public name: string = '',
    public startDate: string = '',
    public startTime: string = '',
    public applications: Application[] = [],
    public lessons: Lesson[] = [],
    public course: Course = null
  ) {
  }
}
