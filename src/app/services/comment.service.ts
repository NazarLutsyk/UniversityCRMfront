import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Comment} from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.commentsURL = config.api + '/comments';
  }

  getCommentById(id: number, query = {}): Observable<Comment[]> {
    const urlToRequest = addParams(`${this.commentsURL}/${id}`, query);
    return this.http.get<Comment[]>(urlToRequest);
  }

  getComments(query = {}): Observable<Comment[]> {
    const urlToRequest = addParams(this.commentsURL, query);
    return this.http.get<Comment[]>(urlToRequest);
  }

  create(model: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentsURL, model);
  }

  remove(id: number | string): Observable<Comment> {
    return this.http.delete<Comment>(`${this.commentsURL}/${id}`);
  }
}
