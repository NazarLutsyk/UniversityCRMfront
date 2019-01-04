import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Eapplication} from '../models/eapplication';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class EapplicationService {

  private eapplicationsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.eapplicationsURL = config.api + '/eapplications';
  }

  getEapplicationById(id: number, query = {}): Observable<Eapplication> {
    const urlToRequest = addParams(`${this.eapplicationsURL}/${id}`, query);
    return this.http.get<Eapplication>(urlToRequest);
  }

  getEapplications(query = {}): Observable<any> {
    const urlToRequest = addParams(this.eapplicationsURL, query);
    return this.http.get<Eapplication[]>(urlToRequest);
  }

  create(model: Eapplication): Observable<Eapplication> {
    return this.http.post<Eapplication>(this.eapplicationsURL, model);
  }

  remove(id: number | string): Observable<Eapplication> {
    return this.http.delete<Eapplication>(`${this.eapplicationsURL}/${id}`);
  }

  update(id: number, eapplication: Eapplication) {
    return this.http.put<Eapplication>(`${this.eapplicationsURL}/${id}`, eapplication);
  }
}
