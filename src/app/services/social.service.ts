import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Social} from '../models/social';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private socialsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.socialsURL = config.api + '/socials';
  }

  getSocialById(id: number, query = {}): Observable<Social> {
    const urlToRequest = addParams(`${this.socialsURL}/${id}`, query);
    return this.http.get<Social>(urlToRequest);
  }

  getSocials(query = {}): Observable<any> {
    const urlToRequest = addParams(this.socialsURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: Social): Observable<Social> {
    return this.http.post<Social>(this.socialsURL, model);
  }

  remove(id: number | string): Observable<Social> {
    return this.http.delete<Social>(`${this.socialsURL}/${id}`);
  }

  update(id: number, social: Social): Observable<Social> {
    return this.http.put<Social>(`${this.socialsURL}/${id}`, social);
  }
}
