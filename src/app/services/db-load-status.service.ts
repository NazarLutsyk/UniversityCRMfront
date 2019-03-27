import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbLoadStatusService {

  $statusPreloadingData = new Subject<string>();

  constructor() {
  }
}
