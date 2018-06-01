import { Injectable, Optional } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

export class AuthenticationServiceConfig {
  apiKey = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _apiKey = '';

  constructor(@Optional() config: AuthenticationServiceConfig) {
    if (config) { this._apiKey = config.apiKey; }
  }
  /**
   * Devuelve API Key
   */
  getApiKey() : string {
    return this._apiKey;
  }

  /*constructor(protected localStorage: LocalStorage) { 
    this.localStorage.setItem('test', 'test');
  }*/
}
