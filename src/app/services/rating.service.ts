import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Rating} from '../models/Rating';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratingsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.ratingsURL = config.api + '/ratings';
  }

  getRatingByCourseId(id: number, query= {}): Observable<Rating> {
    const urlToRequest = addParams(`${this.ratingsURL}/${id}`, query);
    return this.http.get<Rating>(urlToRequest);
  }
}
