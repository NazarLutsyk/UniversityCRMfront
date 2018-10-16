import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {Task} from '../models/task';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.tasksURL = config.api + '/tasks';
  }

  getTaskById(id: number, query = {}): Observable<Task[]> {
    const urlToRequest = addParams(`${this.tasksURL}/${id}`, query);
    return this.http.get<Task[]>(urlToRequest);
  }

  getTasks(query = {}): Observable<Task[]> {
    const urlToRequest = addParams(this.tasksURL, query);
    return this.http.get<Task[]>(urlToRequest);
  }

  create(model: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksURL, model);
  }

  remove(id: number | string): Observable<Task> {
    return this.http.delete<Task>(`${this.tasksURL}/${id}`);
  }
}
