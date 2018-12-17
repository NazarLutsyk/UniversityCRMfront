import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Manager} from '../models/manager';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private managersURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.managersURL = config.api + '/managers';
  }

  getManagerById(id: number, query = {}): Observable<Manager> {
    const urlToRequest = addParams(`${this.managersURL}/${id}`, query);
    return this.http.get<Manager>(urlToRequest);
  }

  getManagers(query = {}): Observable<any> {
    const urlToRequest = addParams(this.managersURL, query);
    return this.http.get<Manager[]>(urlToRequest);
  }

  create(model: Manager): Observable<Manager> {
    return this.http.post<Manager>(this.managersURL, model);
  }

  remove(id: number | string): Observable<Manager> {
    return this.http.delete<Manager>(`${this.managersURL}/${id}`);
  }

  update(id: number, manager: Manager): Observable<Manager> {
    return this.http.put<Manager>(`${this.managersURL}/${id}`, manager);
  }
}
