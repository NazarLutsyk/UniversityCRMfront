import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';

@Injectable({
  providedIn: 'root'
})
export class SendingService {

  private sendingURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.sendingURL = config.api + '/sending';
  }

  sendSms(phones: string[] = null, text: string = ''): Observable<any> {
    const body = {phones, text};
    if (phones && text.length > 0) {
      return this.http.post<any>(`${this.sendingURL}/sms`, body);
    } else {
      return new Observable((subscriber) => subscriber.error(new Error('Missed required parameters')));
    }
  }


  sendMails(emails: string[] = null, text: string = ''): Observable<any> {
    const body = {emails, text};
    if (emails && text.length > 0) {
      return this.http.post<any>(`${this.sendingURL}/mail`, body);
    } else {
      return new Observable((subscriber) => subscriber.error(new Error('Missed required parameters')));
    }
  }

}
