import { Injectable, Optional } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MIAUser } from './miauser';
import { MIAAccessToken } from './miaaccess-token';
import { ApiResponse } from '@mobileia/core';

export class AuthenticationServiceConfig {
  apiKey = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _baseUrl = 'http://authentication.mobileia.com/api/';
  private _keyAccessToken = 'key_access_token';
  private _keyUserId = 'key_user_id';

  private _apiKey = '';

  constructor(private http: HttpClient, protected localStorage: LocalStorage, @Optional() config: AuthenticationServiceConfig) {
    if (config) { this._apiKey = config.apiKey; }
  }

  signInWithEmailAndPassword(email: string, password: string, callback : (response : ApiResponse<MIAAccessToken>) => void) {
    var params = {
      grant_type: "normal",
      app_id: this._apiKey,
      email: email,
      password: password
    };
    this.http.post<ApiResponse<MIAAccessToken>>(this._baseUrl + 'oauth', params).subscribe(data => {
      // Verificar si se logueo correctamente
      if(data.success){
        // Guardar AccessToken
        this.localStorage.setItem(this._keyAccessToken, data.response.access_token).subscribe(() => {});;
        this.localStorage.setItem(this._keyUserId, data.response.user_id).subscribe(() => {});;
      }
      // Llamar al callback
      callback(data);
    });
  }

  getProfile(callback : (data: ApiResponse<MIAUser>) => void) {
    this.getAccessToken().subscribe(token => {
      if(token == null){
        return;
      }
      this.requestProfile(token, callback);
    });
    
  }

  private requestProfile(access_token : string, callback : (data: ApiResponse<MIAUser>) => void) {
    var params = {
      access_token: access_token,
      app_id: this._apiKey
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'me', params).subscribe(data => {
      callback(data);
    });
  }

  registerUser(params) : Observable<ApiResponse<any>> {
    var postParams = {
      app_id: this._apiKey,
      register_type: "normal",
      email: params.email,
      password: params.password,
      firstname: params.firstname,
      lastname: params.lastname,
      platform: 2
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'register', postParams);
  }

  updateUser(params, callback : (data: ApiResponse<MIAUser>) => void) {
    this.getAccessToken().subscribe(token => {
      if(token == null){
        return;
      }
      this.requestUpdateUser(params, token, callback);
    });
    
  }

  private requestUpdateUser(params, access_token : string, callback : (data: ApiResponse<MIAUser>) => void){
    var postParams = {
      app_id: this._apiKey,
      access_token: access_token,
      email: params.email,
      firstname: params.firstname,
      lastname: params.lastname,
      photo: params.photo,
      phone: params.phone
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'update', postParams);
  }

  signOut() {
    this.localStorage.removeItem(this._keyAccessToken).subscribe(() => {});
    this.localStorage.removeItem(this._keyUserId).subscribe(() => {});
    this.localStorage.clear().subscribe(() => {});
  }

  /**
   * Devuelve API Key
   */
  getApiKey() : string {
    return this._apiKey;
  }

  getAccessToken() {
    return this.localStorage.getItem<string>(this._keyAccessToken);
  }

  getUserID(){
    return this.localStorage.getItem<number>(this._keyUserId);
  }

  isLogged(callback : (isUserLogged) => void){
    this.getAccessToken().subscribe(token => {
      if(token == null || token.length == 0){
          callback(false);
      }else{
        callback(true);
      }
    });
  }

  /*constructor(protected localStorage: LocalStorage) { 
    this.localStorage.setItem('test', 'test');
  }*/
}
