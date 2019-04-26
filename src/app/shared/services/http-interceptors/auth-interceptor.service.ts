import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoadOverlayService } from 'core-foundation';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private cookieService: CookieService,
        private loadOverlayService: LoadOverlayService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.showLoader();

        let mycookie = this.cookieService.get('XSRF-TOKEN');
        if (!mycookie) {
            mycookie = "";
        }
       
        let companyid: number = 1;      // this.angular.atsServerValues.companyId;
        if (!companyid) {
            companyid = 0;
        }

        
        //let headers: HttpHeaders = req.headers.set("companyid", companyid.toString());
        //headers = headers.set("X-Requested-With", " XMLHttpRequest");
        //headers = headers.set("X-XSRF-TOKEN", mycookie);
        //headers = headers.set("Cache-Control", "no-cache");
        //headers = headers.set("Pragma", "no-cache");

        //const authReq = req.clone({
        //    headers: headers
        //});

        const authReq = req.clone({
            setHeaders: {
                "companyid": companyid.toString(), 
                "X-Requested-With": " XMLHttpRequest", 
                "X-XSRF-TOKEN": mycookie, 
                "Cache-Control": "no-cache", 
                "Pragma": "no-cache"
            }
        });

        return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.onEnd();
            }
        }, (err: any) => {
            this.onEnd();
        }));
    }

    private onEnd(): void {
        this.hideLoader();
    }
    private showLoader(): void {
        this.loadOverlayService.show();
    }
    private hideLoader(): void {
        this.loadOverlayService.hide();
    }
}