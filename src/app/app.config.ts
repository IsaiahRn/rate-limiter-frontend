import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};



// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';

// import { provideStore } from '@ngrx/store';
// import { provideEffects } from '@ngrx/effects';
// import { reducers } from './state';
// import { RateLimiterEffects } from './state/rate-limiter.effects';

// import {
//   HTTP_INTERCEPTORS,
//   provideHttpClient,
//   withInterceptorsFromDi
// } from '@angular/common/http';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';

// import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),

//     provideStore(reducers),
//     provideEffects([RateLimiterEffects]),

//     provideHttpClient(withInterceptorsFromDi()),
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: JwtInterceptor,
//       multi: true
//     },

//     importProvidersFrom(
//       BrowserAnimationsModule,
//       ToastrModule.forRoot({
//         positionClass: 'toast-bottom-right',
//         timeOut: 3000,
//         closeButton: true,
//         progressBar: true,
//         preventDuplicates: true
//       })
//     )
//   ]
// };
