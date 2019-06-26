import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../models/client';
import {Ufile} from '../models/ufile';
import {ConfigService} from './config.service';
import {addParams} from '../helpers/url-helper';
import {Address} from '../models/address';

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

  getClientById(id: number, query = {}): Observable<Client> {
    const urlToRequest = addParams(`${this.clientsURL}/${id}`, query);
    return this.http.get<Client>(urlToRequest);
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

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.clientsURL}/${id}`, client);
  }

  uploadPassportFiles(clientId: number, images: File[]): Observable<Ufile[]> {
    const formData: FormData = new FormData();
    for (const image of images) {
      formData.append('passports', image, image.name);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<Ufile[]>(
      `${this.clientsURL}/${clientId}/passport/upload`,
      formData,
      {headers: headers}
    );
  }

  exists(client: Client): Observable<Client[]> {
    return this.http.post<Client[]>(this.clientsURL + '/exists', client);
  }

  existsForEapp(client): Observable<any[]> {
    return this.http.post<any[]>(this.clientsURL + '/exists', client);
  }

  getClientByIdWithLessons(id) {
    return this.http.get<Client>(`${this.clientsURL}/${id}/lessons`);
  }

  getLocations(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.clientsURL}/addresses`);
  }
}
