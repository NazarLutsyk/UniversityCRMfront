import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Manager} from '../models/manager';
import {map} from 'rxjs/operators';
import {Roles} from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public principal: Manager = null;
  public roles = Roles;

  private authURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.authURL = config.api + '/auth';
  }

  public login(credentials: { login: string, passwod: string }): Observable<Manager> {
    return this.http.post<Manager>(`${this.authURL}/login`, credentials)
      .pipe(map(p => {
        this.principal = p;
        return p;
      }));
  }

  public logout(): Observable<any> {
    return this.http.get<any>(`${this.authURL}/logout`).pipe(map(p => {
      this.principal = null;
      return p;
    }));
  }

  public getPrincipal(): Observable<Manager> {
    return this.http.get<Manager>(`${this.authURL}/principal`)
      .pipe(map(p => {
        this.principal = p;
        return p;
      }));
  }

  public getLocalPrincipal() {
    return this.principal;
  }

}
