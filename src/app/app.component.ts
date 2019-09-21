import { Component } from '@angular/core';
import { AuthenticationService } from '../../projects/mobileia/authentication/src/lib/authentication.service';
import { TestServiceService } from './test-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private service: AuthenticationService) {

    this.service.isLoggedIn.subscribe(data => {
      console.log('Logged:');
      console.log(data);
    });

    this.service.currentUser.subscribe(data => {
      console.log('User:');
      console.log(data);
    });

    /*this.service.signInWithEmailAndPassword('matiascamiletti@mobileia.com', '123456').subscribe(data => {
      console.log('User:');
      console.log(data);
    });*/
      //alert("LA Key es: " + service.getApiKey());
  }

  onLogin() {
    this.service.signInWithEmailAndPassword('matiascamiletti@mobileia.com', '123456').subscribe(data => {
      console.log('User:');
      console.log(data);
    });
  }
}
