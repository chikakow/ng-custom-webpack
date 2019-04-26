import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnsureHttpsInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // clone request and replace 'http://' with 'https://' at the same time
        const secureReq = req.clone({
            url: req.url.replace('http://', 'https://')
        });

        // send the cloned, "secure" request to the next handler.
        return next.handle(secureReq);
    }
}