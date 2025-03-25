import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { routes } from './app.routes';
import { JwtInterceptor } from './services/jwt.interceptor';

// Utilitaire pour convertir une classe HttpInterceptor en HttpInterceptorFn
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
  const interceptor = inject(JwtInterceptor); // Injecte l'instance de JwtInterceptor
  return interceptor.intercept(req, { handle: next });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimisation de la détection de changements
    provideRouter(routes), // Routage
    provideHttpClient(
      withInterceptors([jwtInterceptorFn]), // Utilise la fonction convertie
    ),
    provideAnimations(), // Active les animations pour Angular Material
    {
      provide: ServiceWorkerModule,
      useFactory: () => ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: true, // Active le service worker pour le PWA
        registrationStrategy: 'registerWhenStable:30000',
      }),
    },
    JwtInterceptor, // Fournit JwtInterceptor comme provider pour l'injection
  ],
};