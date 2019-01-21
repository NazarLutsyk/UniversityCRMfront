import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UfileService {

  private filesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.filesURL = config.api + '/files';
  }

  remove(id: number | string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.filesURL}/${id}`);
  }
}
