import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {City} from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private citiesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.citiesURL = config.api + '/cities';
  }

  getCityById(id: number, query = {}): Observable<City> {
    const urlToRequest = addParams(`${this.citiesURL}/${id}`, query);
    return this.http.get<City>(urlToRequest);
  }

  getCities(query = {}): Observable<any> {
    const urlToRequest = addParams(this.citiesURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: City): Observable<City> {
    return this.http.post<City>(this.citiesURL, model);
  }

  remove(id: number | string): Observable<City> {
    return this.http.delete<City>(`${this.citiesURL}/${id}`);
  }

  update(id: number, city: City): Observable<City> {
    return this.http.put<City>(`${this.citiesURL}/${id}`, city);
  }
}
