import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {AudioCall} from '../models/audio-call';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ufile} from '../models/ufile';

@Injectable({
  providedIn: 'root'
})
export class AudioCallService {

  private audioCallsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.audioCallsURL = config.api + '/audioCalls';
  }

  getAudioCallById(id: number, query = {}): Observable<AudioCall> {
    const urlToRequest = addParams(`${this.audioCallsURL}/${id}`, query);
    return this.http.get<AudioCall>(urlToRequest);
  }

  getAudioCalls(query = {}): Observable<AudioCall[]> {
    const urlToRequest = addParams(this.audioCallsURL, query);
    return this.http.get<AudioCall[]>(urlToRequest);
  }

  create(model: AudioCall): Observable<AudioCall> {
    return this.http.post<AudioCall>(this.audioCallsURL, model);
  }

  remove(id: number | string): Observable<AudioCall> {
    return this.http.delete<AudioCall>(`${this.audioCallsURL}/${id}`);
  }

  uploadFiles(audioCallId: number, images: File[]): Observable<Ufile[]> {
    const formData: FormData = new FormData();
    for (const image of images) {
      formData.append('files', image, image.name);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<Ufile[]>(
      `${this.audioCallsURL}/${audioCallId}/upload`,
      formData,
      {headers: headers}
    );
  }

  update(id: number, audioCall: AudioCall): Observable<AudioCall> {
    return this.http.put<AudioCall>(`${this.audioCallsURL}/${id}`, audioCall);
  }


}
