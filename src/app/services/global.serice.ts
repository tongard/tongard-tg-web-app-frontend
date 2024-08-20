import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private token: any = null;
  private isAdmin: boolean = false;
  userState:any;
  private userSubject = new BehaviorSubject<any>(null);
  user$: Observable<any> = this.userSubject.asObservable();

  private barMenuSub = new BehaviorSubject<any>(null);
  barMenu$: Observable<any> = this.barMenuSub.asObservable();
  private lng: string = 'en';
  constructor(private userService: UserService) {
    this.token = {};


  }

  setLng(lng: string) {
    this.lng = lng;
  }

  getLng() {
    return this.lng;
  }

  setAdmin(status: boolean) {
    this.isAdmin = status;
  }

  getAdmin() {
    return this.isAdmin;
  }
  // Метод для получения значения переменной
  getToken(): any {
    return this.token;
  }

  // Метод для изменения значения переменной
  setToken(value: any): void {
    this.token = value;
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  showBar() {
    this.barMenuSub.next(true);
  }

  hideBar() {
    this.barMenuSub.next(false);
  }

  getMenuState(): Observable<any> {
    return this.barMenu$;
  }

  getUser(): Observable<any> {
    return this.user$;
  }

  refreshUser(): Observable<any> {
    return this.userService.getMe().pipe(
      tap((user: any) => {
        this.setUser(user);
        this.userState = user;
      }),
      take(1)
    );
  }
}