import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../models/client';
import {ConfigService} from './config.service';

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

  getClients(query = {}): Observable<Client[]> {
    let urlToRequest = this.clientsURL + '?';
    for (const key in query) {
      if (query[key]) {
        urlToRequest += `${key}=${JSON.stringify(query[key])}&`;
      }
    }
    return this.http.get<Client[]>(urlToRequest);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientsURL, client);
  }

  remove(id: number | string): Observable<Client> {
    return this.http.delete<Client>(`${this.clientsURL}/${id}`);
  }
}
