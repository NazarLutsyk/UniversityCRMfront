import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private statisticURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.statisticURL = config.api + '/statistic';
  }

  getManagersStatisticByCity(): Observable<any> {
    const urlToRequest = addParams(`${this.statisticURL}/city-manager`, {});
    return this.http.get<any>(urlToRequest);
  }

  getApplicationsStatisticByCity(query): Observable<any> {
    const urlToRequest = addParams(`${this.statisticURL}/city-application`, query);
    return this.http.get<any>(urlToRequest);
  }

  getApplicationsStatisticBySource(query): Observable<any> {
    const urlToRequest = addParams(`${this.statisticURL}/source-application`, query);
    return this.http.get<any>(urlToRequest);
  }

  getApplicationsStatisticByCourse(query): Observable<any> {
    const urlToRequest = addParams(`${this.statisticURL}/course-application`, query);
    return this.http.get<any>(urlToRequest);
  }

  getJournalStatisticByGroup(query): Observable<any> {
    const urlToRequest = addParams(`${this.statisticURL}/group-journal`, query);
    return this.http.get<any>(urlToRequest);
  }

}
