import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private baseUrl = environment.baseUrl + '/api'; 

  constructor(private http: HttpClient) { }

  getMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/u/user/me`);
  }

  getInvite(): Observable<any> {
    return this.http.get(`${this.baseUrl}/u/user/invite`);
  }

}