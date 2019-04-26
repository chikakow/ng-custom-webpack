import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest,
    HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

// no-op interceptor simply calls next.handle() with the original request and 
// returns the observable without doing a thing.

@Injectable({
  providedIn: 'root'
})
export class NoOpInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // do nothing
        return next.handle(req);
    }

  constructor() { }
}