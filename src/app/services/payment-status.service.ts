import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {ConfigService} from './config.service';
import {PaymentStatus} from '../models/paymentStatus';

@Injectable({
  providedIn: 'root'
})
export class PaymentStatusService {
  private statusesURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.statusesURL = config.api + '/payment-status';
  }

  getStatusById(id: number, query = {}): Observable<PaymentStatus> {
    const urlToRequest = addParams(`${this.statusesURL}/${id}`, query);
    return this.http.get<PaymentStatus>(urlToRequest);
  }

  getStatuses(query = {}): Observable<any> {
    const urlToRequest = addParams(this.statusesURL, query);
    return this.http.get<any>(urlToRequest);
  }

  create(model: PaymentStatus): Observable<PaymentStatus> {
    return this.http.post<PaymentStatus>(this.statusesURL, model);
  }

  remove(id: number | string): Observable<PaymentStatus> {
    return this.http.delete<PaymentStatus>(`${this.statusesURL}/${id}`);
  }

  update(id: number, status: PaymentStatus): Observable<PaymentStatus> {
    return this.http.put<PaymentStatus>(`${this.statusesURL}/${id}`, status);
  }
}
