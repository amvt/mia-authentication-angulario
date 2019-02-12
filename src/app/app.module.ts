import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthenticationModule } from '../../projects/mobileia/authentication/src/lib/authentication.module';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule.forRoot({apiKey: "16"})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
