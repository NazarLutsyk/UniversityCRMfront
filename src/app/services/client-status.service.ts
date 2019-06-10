import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {ClientStatus} from '../models/client-status';

@Injectable({
  providedIn: 'root'
})
export class ClientStatusService {

  private statusesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.statusesURL = config.api + '/clients-statuses';
  }

  getStatusById(id: number, query = {}): Observable<ClientStatus> {
    const urlToRequest = addParams(`${this.statusesURL}/${id}`, query);
    return this.http.get<ClientStatus>(urlToRequest);
  }

  getStatuses(query = {}): Observable<any> {
    const urlToRequest = addParams(this.statusesURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: ClientStatus): Observable<ClientStatus> {
    return this.http.post<ClientStatus>(this.statusesURL, model);
  }

  remove(id: number | string): Observable<ClientStatus> {
    return this.http.delete<ClientStatus>(`${this.statusesURL}/${id}`);
  }

  update(id: number, status: ClientStatus): Observable<ClientStatus> {
    return this.http.put<ClientStatus>(`${this.statusesURL}/${id}`, status);
  }
}
