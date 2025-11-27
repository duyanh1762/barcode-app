import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

import { ScanComponent } from './app/scan/scan.component';
import { ProductListComponent } from './app/product-list/product-list.component';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
        { path: '', redirectTo: 'scan', pathMatch: 'full' },
        { path: 'scan', component: ScanComponent },
        { path: 'list', component: ProductListComponent },
    ]),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
});
