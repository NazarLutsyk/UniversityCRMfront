import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import * as socketIo from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public EMAIL_EVENT = 'mail';
  private socket;

  constructor(
    private configService: ConfigService
  ) {
    this.socket = socketIo(this.configService.host);
  }

  public onEvent(event): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }
}
