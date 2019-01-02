import {City} from './city';
import {Roles} from './roles';

export class Manager {
  constructor(
    public id: number = null,
    public login: string = '',
    public password: string = '',
    public name: string = '',
    public surname: string = '',
    public role: Roles = null,
    public cityId: number = null,
    public city: City = null,
  ) {
  }
}
