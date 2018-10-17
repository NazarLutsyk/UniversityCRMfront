import {Group} from './group';
import {Application} from './application';

export class Lesson {
  constructor(
    public id: number = null,
    public topic: string = '',
    public main: boolean = false,
    public group: Group = null,
    public groupId: number = null,
    public applications: Application[] = []
  ) {
  }
}
