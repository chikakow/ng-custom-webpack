import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LogService } from '../log.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogInterceptorService {

    constructor(
        private logService: LogService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        let ok: any;

        // extend server response observable with logging
        return next.handle(req)
            .pipe(
                tap(
                    // Succeeds when there is a response; ignore other events
                event => ok = event instanceof HttpResponse ? event.clone({ body: event.body }) : { success: "success" },
                    // Operation failed; error is an HttpErrorResponse
                    error => {
                        if (error instanceof HttpErrorResponse) {
                            ok = error;
                        }
                        else {
                            ok = { failed: "failed" };
                        }
                        // ok = error instanceof HttpErrorResponse ? {} : 'failed';
                    }
                ),
                // Log when response observable either completes or errors
                finalize(() => {
                    const elapsed = Date.now() - started;
             //       const msg = `${req.method} "${req.urlWithParams}"
                    //${ok} in ${elapsed} ms.`;

                    let reqHdrs: { key: string, value: string }[] = [];
                    let keys = req.headers.keys();
                    keys.forEach((k) => {
                        reqHdrs.push({ key: k, value: req.headers.get(k) });
                    });

                    let reqParams: { key: string, value: string }[] = [];
                    keys = req.params.keys();
                    keys.forEach((k) => {
                        reqParams.push({ key: k, value: req.headers.get(k) });
                    });

                    let msgObj = {
                        reqMethod: req.method,
                        reqHdrs: reqHdrs,
                        reqParams: reqParams,
                        url: req.urlWithParams,
                        reqBody: req.serializeBody(),
                        // routeTree: this.router.parseUrl(this.router.url),
                        responseTime: elapsed,
                        // response: ok,
                        respStatus: ok.status,
                        respStatusText: ok.statusText,
                        respBody: ok.body
                    };

                    this.logService.add(msgObj);
                })
            );
    }
}
