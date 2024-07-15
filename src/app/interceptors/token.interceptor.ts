import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GlobalService } from '../services/global.serice';
import { retrieveLaunchParams } from '@tma.js/sdk';


@Injectable({ providedIn: 'root' }) // Provide in root for global application-wide usage
export class TokenInterceptor implements HttpInterceptor {
  constructor(private globalService: GlobalService) {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { initDataRaw, initData } = retrieveLaunchParams();
  
    if (initDataRaw) {
        request = request.clone({
          setHeaders: {
            'X-Telegram-Init-Data': initDataRaw,
            'X-Telegram-Uid': initData?.user?.id +''
          }
        });
      }

    const token = this.globalService.getToken();

    // Add authorization header if token is available
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `${token}` },
      });
    }

    // Handle successful and error responses
    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          // Handle successful responses here (optional)
        }
      }),
      catchError((error) => {
        // Handle errors in a centralized way (optional)
        console.error('HTTP request error:', error);
        // Handle specific error cases (e.g., unauthorized access, network errors)
        if (error.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          console.warn('Unauthorized access (401)');
          // Perform actions like redirecting to login or refreshing token
        } else if (error.error instanceof ErrorEvent) {
          // Client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // Backend returned an unsuccessful response code
          // (e.g., 404, 500)
          console.error(`Backend returned code ${error.status}`);
        }
        return of(error); // Re-throw the error to allow callers to handle it
      })
    );
  }
}