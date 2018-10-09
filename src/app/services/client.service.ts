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
    return this.http.get<Client[]>(this.clientsURL);
  }

}
