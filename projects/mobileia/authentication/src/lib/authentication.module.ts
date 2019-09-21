import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthenticationComponent } from './authentication.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationServiceConfig } from './authentication.service';
import { StorageModule } from '@ngx-pwa/local-storage';

@NgModule({
  imports: [
    HttpClientModule,
    StorageModule.forRoot({ IDBNoWrap: true })
  ],
  declarations: [AuthenticationComponent],
  exports: [AuthenticationComponent],
  providers: [
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
