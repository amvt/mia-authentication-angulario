import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthenticationComponent } from './authentication.component';
import { localStorageProviders } from '@ngx-pwa/local-storage';
import { AuthenticationServiceConfig } from '../public_api';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [AuthenticationComponent],
  exports: [AuthenticationComponent],
  providers: [
    localStorageProviders({ prefix: 'mia-authentication' })
  ]
})
export class AuthenticationModule {
  constructor (@Optional() @SkipSelf() parentModule: AuthenticationModule) {
    if (parentModule) {
      throw new Error(
        'AuthenticationModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: AuthenticationServiceConfig): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        {provide: AuthenticationServiceConfig, useValue: config }
      ]
    };
  }
}
