import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // הוספנו את withInterceptors

// ייבוא האינטרספטור שיצרנו (וודאי שהנתיב נכון)
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // כאן הוספנו את האינטרספטור לתוך ה-HttpClient
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};