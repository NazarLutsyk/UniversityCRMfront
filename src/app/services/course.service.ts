import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Course} from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.coursesURL = config.api + '/courses';
  }

  getCourseById(id: number, query = {}): Observable<Course[]> {
    const urlToRequest = addParams(`${this.coursesURL}/${id}`, query);
    return this.http.get<Course[]>(urlToRequest);
  }

  getCourses(query = {}): Observable<Course[]> {
    const urlToRequest = addParams(this.coursesURL, query);
    return this.http.get<Course[]>(urlToRequest);
  }

  create(model: Course): Observable<Course> {
    return this.http.post<Course>(this.coursesURL, model);
  }

  remove(id: number | string): Observable<Course> {
    return this.http.delete<Course>(`${this.coursesURL}/${id}`);
  }
}
