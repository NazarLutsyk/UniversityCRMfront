import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {CompetitorApplication} from '../models/competitor-application';

@Injectable({
  providedIn: 'root'
})
export class CompetitorApplicationService {

  private competitorApplicationsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.competitorApplicationsURL = config.api + '/competitor-applications';
  }

  getCompetitorApplicationById(id: number, query = {}): Observable<CompetitorApplication> {
    const urlToRequest = addParams(`${this.competitorApplicationsURL}/${id}`, query);
    return this.http.get<CompetitorApplication>(urlToRequest);
  }

  getCompetitorApplications(query = {}): Observable<any> {
    const urlToRequest = addParams(this.competitorApplicationsURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: CompetitorApplication): Observable<CompetitorApplication> {
    return this.http.post<CompetitorApplication>(this.competitorApplicationsURL, model);
  }

  remove(id: number | string): Observable<CompetitorApplication> {
    return this.http.delete<CompetitorApplication>(`${this.competitorApplicationsURL}/${id}`);
  }

  update(id: number, competitorApplication: CompetitorApplication): Observable<CompetitorApplication> {
    return this.http.put<CompetitorApplication>(`${this.competitorApplicationsURL}/${id}`, competitorApplication);
  }
}
