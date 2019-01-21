import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Contract} from '../models/contract';
import {Ufile} from '../models/ufile';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private contractsURL = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.contractsURL = config.api + '/contracts';
  }

  getContractById(id: number, query = {}): Observable<Contract> {
    const urlToRequest = addParams(`${this.contractsURL}/${id}`, query);
    return this.http.get<Contract>(urlToRequest);
  }

  getContracts(query = {}): Observable<Contract[]> {
    const urlToRequest = addParams(this.contractsURL, query);
    return this.http.get<Contract[]>(urlToRequest);
  }

  create(model: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.contractsURL, model);
  }

  remove(id: number | string): Observable<Contract> {
    return this.http.delete<Contract>(`${this.contractsURL}/${id}`);
  }

  createContracts(applicationId: number, filesToUpload: File[]): Observable<Ufile[]> {
    const formData: FormData = new FormData();
    for (const image of filesToUpload) {
      formData.append('files', image, image.name);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<Ufile[]>(
      `${this.contractsURL}/${applicationId}`,
      formData,
      {headers: headers}
    );
  }

  uploadContractFiles(contractId: number, filesToUpload: File[]) {
    const formData: FormData = new FormData();
    for (const image of filesToUpload) {
      formData.append('files', image, image.name);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<Ufile[]>(
      `${this.contractsURL}/${contractId}/upload`,
      formData,
      {headers: headers}
    );
  }
}
