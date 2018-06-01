import { Component } from '@angular/core';
import { AuthenticationService } from '../../projects/mobileia/authentication/src/lib/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(service: AuthenticationService){
      //alert("LA Key es: " + service.getApiKey());
  }
}
