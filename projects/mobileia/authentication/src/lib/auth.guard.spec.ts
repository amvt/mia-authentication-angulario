import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthenticationModule } from '../public_api';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  /*beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AuthenticationModule.forRoot({apiKey: "8"}), RouterModule.forRoot([])],
      providers: [AuthGuard]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));*/
});
