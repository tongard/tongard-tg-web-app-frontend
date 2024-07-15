import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private baseUrl = environment.baseUrl + '/api/u/task'; // URL вашего бэкенда

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }


  start(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/start`, {id});
  }

  claim(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/claim`, {id});
  }

  sendEmail(email:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sendEmail`, {email});
  }

  sendCode(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirmEmail`, {code});
  }
}
