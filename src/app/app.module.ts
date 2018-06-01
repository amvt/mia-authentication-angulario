import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthenticationModule } from '../../projects/mobileia/authentication/src/lib/authentication.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthenticationModule.forRoot({apiKey: "2342342AAAAA"})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
