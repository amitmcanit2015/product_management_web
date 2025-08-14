import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { TranslateModule } from '@ngx-translate/core';  
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    // Initialize TranslateModule
    TranslateModule.forRoot().providers || []
  ]
}).catch(err => console.error(err));
