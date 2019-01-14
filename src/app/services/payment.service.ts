import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Payment} from '../models/payment';
import {Ufile} from '../models/ufile';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.paymentsURL = config.api + '/payments';
  }

  getPaymentById(id: number, query = {}): Observable<Payment> {
    const urlToRequest = addParams(`${this.paymentsURL}/${id}`, query);
    return this.http.get<Payment>(urlToRequest);
  }

  getPayments(query = {}): Observable<Payment[]> {
    const urlToRequest = addParams(this.paymentsURL, query);
    return this.http.get<Payment[]>(urlToRequest);
  }

  create(model: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.paymentsURL, model);
  }

  remove(id: number | string): Observable<Payment> {
    return this.http.delete<Payment>(`${this.paymentsURL}/${id}`);
  }

  uploadFiles(paymentId: number, images: File[]): Observable<Ufile[]> {
    const formData: FormData = new FormData();
    for (const image of images) {
      formData.append('files', image, image.name);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<Ufile[]>(
      `${this.paymentsURL}/${paymentId}/upload`,
      formData,
      {headers: headers}
    );
  }
}
