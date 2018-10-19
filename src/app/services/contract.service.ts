import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {addParams} from '../helpers/url-helper';
import {Contract} from '../models/contract';

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
}
