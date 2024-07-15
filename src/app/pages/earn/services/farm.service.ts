import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class FarmService {

  private baseUrl = environment.baseUrl + '/api';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<any> {

    return this.http.get(`${this.baseUrl}/u/farm/status`);
  }

  claim(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/u/farm/claim`, data);
  }

  getPoints(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/u/farm/points`, data);
  }
}