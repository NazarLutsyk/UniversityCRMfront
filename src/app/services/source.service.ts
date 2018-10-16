import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Source} from '../models/source';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  private sourcesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.sourcesURL = config.api + '/sources';
  }

  getSourceById(id: number, query = {}): Observable<Source[]> {
    const urlToRequest = addParams(`${this.sourcesURL}/${id}`, query);
    return this.http.get<Source[]>(urlToRequest);
  }

  getSources(query = {}): Observable<Source[]> {
    const urlToRequest = addParams(this.sourcesURL, query);
    return this.http.get<Source[]>(urlToRequest);
  }

  create(model: Source): Observable<Source> {
    return this.http.post<Source>(this.sourcesURL, model);
  }

  remove(id: number | string): Observable<Source> {
    return this.http.delete<Source>(`${this.sourcesURL}/${id}`);
  }
}
