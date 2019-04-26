import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoOpInterceptorService } from './no-op-interceptor.service';
import { AuthInterceptorService } from './auth-interceptor.service';
// import { EnsureHttpsInterceptorService } from './ensure-https-interceptor.service';
import { LogInterceptorService } from './log-interceptor.service';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: NoOpInterceptorService, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: LogInterceptorService, multi: true }
];