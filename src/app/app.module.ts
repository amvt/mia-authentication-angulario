import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthenticationModule } from '../../projects/mobileia/authentication/src/lib/authentication.module';

import { HttpClientModule } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { Routes, RouterModule } from '@angular/router';
import { PrivatComponent } from './pages/privat/privat.component';
import { AuthGuard } from 'projects/mobileia/authentication/src/lib/auth.guard';

const appRoutes: Routes = [
  {
    path     : 'inicio',
    component: AppComponent
  },
  {
    path     : 'login',
    component: AppComponent
  },
  {
    path     : 'private',
    component: PrivatComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PrivatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule.forRoot({apiKey: '16', isInternal: false, baseUrlInternal: '' }),
    StorageModule.forRoot({ IDBNoWrap: true }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
