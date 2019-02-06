import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  applicationsLevel: any = null;
  taskLevel: any = null;
  sendingLevel: any = {};
  competitorApplicationsLevel: any = null;

  constructor() {
  }
}
