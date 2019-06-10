import {Application} from './application';
import {Lesson} from './lesson';
import {Course} from './course';
import {City} from './city';

export class Group {
  constructor(
    public id: number = null,
    public name: string = '',
    public startDate: string = '',
    public startTime: string = '',
    public expirationDate: string = '',
    public freePractice: number = 0,
    public usedPractice: number = 0,
    public teacher: string = '',
    public applications: Application[] = [],
    public lessons: Lesson[] = [],
    public course: Course = null,
    public courseId: number = null,
    public city: City = null,
    public cityId: number = null
  ) {
  }
}
