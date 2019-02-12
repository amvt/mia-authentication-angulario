import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MiaAuthHttpService, AuthenticationService } from 'projects/mobileia/authentication/src/public_api';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService extends MiaAuthHttpService {

  constructor(protected http: HttpClient, protected authService: AuthenticationService) {
    super(http, authService);
  }
}
