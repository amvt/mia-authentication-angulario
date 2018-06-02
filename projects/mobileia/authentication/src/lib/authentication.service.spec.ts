import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { AuthenticationModule } from '../public_api';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AuthenticationModule.forRoot({apiKey: "8"})],
      providers: [AuthenticationService]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  it('Register user', inject([AuthenticationService], (service: AuthenticationService) => {
    service.registerUser({email: "mati254353545@gmail.com", password: "123456", firstname: "Matias", lastname: "Testing"}).subscribe(response => {
      if(!response.success){
          //console.log(response.error.message);
      }
      console.log(response);
    });
  }));

  it('Sign in with mail', inject([AuthenticationService], (service: AuthenticationService) => {
    service.signInWithEmailAndPassword("mati254353545@gmail.com", "123456", (data => {
      if(data.success){
        console.log(data.response.access_token);
      }
    }));
  }));

  it('Is user logged', inject([AuthenticationService], (service: AuthenticationService) => {
    service.isLogged((data => {
        console.log("Usuario logueado: " + data);
    }));
  }));

  it('fetch Profile user logged', inject([AuthenticationService], (service: AuthenticationService) => {
    service.getProfile(data => {
        console.log(data.response.email);
    });
  }));
});
