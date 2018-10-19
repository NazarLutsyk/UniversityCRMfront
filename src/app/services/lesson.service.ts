import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Lesson} from '../models/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private lessonsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.lessonsURL = config.api + '/lessons';
  }

  getLessonById(id: number, query = {}): Observable<Lesson> {
    const urlToRequest = addParams(`${this.lessonsURL}/${id}`, query);
    return this.http.get<Lesson>(urlToRequest);
  }

  getLessons(query = {}): Observable<Lesson[]> {
    const urlToRequest = addParams(this.lessonsURL, query);
    return this.http.get<Lesson[]>(urlToRequest);
  }

  create(model: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.lessonsURL, model);
  }

  remove(id: number | string): Observable<Lesson> {
    return this.http.delete<Lesson>(`${this.lessonsURL}/${id}`);
  }
}
