import {City} from './city';

export class Manager {
  constructor(
    public id: number = null,
    public login: string = '',
    public password: string = '',
    public name: string = '',
    public surname: string = '',
    public role: string = '',
    public cityId: number = null,
    public city: City = null,
  ) {
  }
}
