import {Application} from './application';

export class Source {
  constructor(
    public id: number = null,
    public name: string = '',
    public applications: Application[] = []
  ) {
  }
}
