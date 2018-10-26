import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Group} from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.groupsURL = config.api + '/groups';
  }

  getGroupById(id: number, query = {}): Observable<Group> {
    const urlToRequest = addParams(`${this.groupsURL}/${id}`, query);
    return this.http.get<Group>(urlToRequest);
  }

  getGroups(query = {}): Observable<any> {
    const urlToRequest = addParams(this.groupsURL, query);
    return this.http.get<Group[]>(urlToRequest);
  }

  create(model: Group): Observable<Group> {
    return this.http.post<Group>(this.groupsURL, model);
  }

  remove(id: number | string): Observable<Group> {
    return this.http.delete<Group>(`${this.groupsURL}/${id}`);
  }

  update(id: number, group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.groupsURL}/${id}`, group);
  }
}
