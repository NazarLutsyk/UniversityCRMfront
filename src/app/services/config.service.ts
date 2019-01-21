import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  host = 'http://localhost:3000';
  api = this.host + '/api';
  public = this.host + '/upload';

  constructor() {
  }
}
