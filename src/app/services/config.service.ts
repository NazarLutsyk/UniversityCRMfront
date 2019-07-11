import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // host = 'http://localhost:3000';
  // host = 'http://ec2-3-82-41-130.compute-1.amazonaws.com:3000';
  host = 'http://ec2-52-90-74-194.compute-1.amazonaws.com:3000';
  api = this.host + '/api';
  public = this.host + '/upload';

  constructor() {
  }
}

