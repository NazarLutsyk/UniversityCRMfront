import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Competitor} from '../models/competitor';

@Injectable({
  providedIn: 'root'
})
export class CompetitorService {

  private competitorsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.competitorsURL = config.api + '/competitors';
  }

  getCompetitorById(id: number, query = {}): Observable<Competitor> {
    const urlToRequest = addParams(`${this.competitorsURL}/${id}`, query);
    return this.http.get<Competitor>(urlToRequest);
  }

  getCompetitors(query = {}): Observable<any> {
    const urlToRequest = addParams(this.competitorsURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: Competitor): Observable<Competitor> {
    return this.http.post<Competitor>(this.competitorsURL, model);
  }

  remove(id: number | string): Observable<Competitor> {
    return this.http.delete<Competitor>(`${this.competitorsURL}/${id}`);
  }

  update(id: number, competitor: Competitor): Observable<Competitor> {
    return this.http.put<Competitor>(`${this.competitorsURL}/${id}`, competitor);
  }
}
