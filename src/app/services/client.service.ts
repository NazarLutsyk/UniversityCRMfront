import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../models/client';
import {ConfigService} from './config.service';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.clientsURL = config.api + '/clients';
  }

  getClientById(id: number, query = {}): Observable<Client[]> {
    const urlToRequest = addParams(`${this.clientsURL}/${id}`, query);
    return this.http.get<Client[]>(urlToRequest);
  }

  getClients(query = {}): Observable<Client[]> {
    const urlToRequest = addParams(this.clientsURL, query);
    return this.http.get<Client[]>(urlToRequest);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientsURL, client);
  }

  remove(id: number | string): Observable<Client> {
    return this.http.delete<Client>(`${this.clientsURL}/${id}`);
  }
}
