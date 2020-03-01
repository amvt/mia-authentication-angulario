import { Injectable, Optional } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MIAUser } from './miauser';
import { MIAAccessToken } from './miaaccess-token';
import { ApiResponse } from '@mobileia/core';

export class AuthenticationServiceConfig {
  apiKey = '';
  isInternal = false;
  baseUrlInternal = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _baseUrl = 'https://authentication.mobileia.com/api/';
  private _baseUrlInternal = '';
  private _isInternal = false;
  private _keyAccessToken = 'key_access_token';
  private _keyUserId = 'key_user_id';
  private _keyUserData = 'key_user_data';

  private _apiKey = '';
  public currentUser: BehaviorSubject<MIAUser>;
  public isLoggedIn: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private storage: StorageMap,
    @Optional() config: AuthenticationServiceConfig) {
    if (config) { 
      this._apiKey = config.apiKey;
    }
    if (config && config.baseUrlInternal) {
      this._baseUrlInternal = config.baseUrlInternal;
    }
    if (config && config.isInternal) {
      this._isInternal = config.isInternal;
    }
    // Creamos observable de la variable que informa que se loguea
    this.isLoggedIn = new BehaviorSubject<boolean>(false);
    // Creamos observable para el usuario logueado
    this.currentUser = new BehaviorSubject<MIAUser>(null);
    // Verificar si esta logueado
    this.getAccessToken().subscribe(accessToken => {
      if (accessToken == null || !this._isInternal) {
        return;
      }
      // Cargar profile
      this.loadProfile();
    });
  }

  signInWithGoogle(authToken: string, googleToken: string): Observable<ApiResponse<MIAAccessToken>> {
    const params = {
      grant_type: 'google',
      app_id: this._apiKey,
      auth_token: authToken,
      google_token: googleToken
    };
    return this.http.post<ApiResponse<MIAAccessToken>>(this._baseUrl + 'oauth', params)
    .pipe(map(data => {

      // Verificar si se logueo correctamente
      if (data.success) {
        // Guardar AccessToken
        this.storage.set(this._keyAccessToken, data.response.access_token).subscribe(() => {
          // Buscar datos del perfil
          this.loadProfile();
        });
        this.storage.set(this._keyUserId, data.response.user_id).subscribe(() => {});
        // Guardar que esta logueado
        this.isLoggedIn.next(true);
      }

      return data;
    }));
  }

  signInWithFacebook(facebookId: string, facebookToken: string): Observable<ApiResponse<MIAAccessToken>> {
    const params = {
      grant_type: 'facebook',
      app_id: this._apiKey,
      facebook_id: facebookId,
      facebook_access_token: facebookToken
    };
    return this.http.post<ApiResponse<MIAAccessToken>>(this._baseUrl + 'oauth', params)
    .pipe(map(data => {

      // Verificar si se logueo correctamente
      if (data.success) {
        // Guardar AccessToken
        this.storage.set(this._keyAccessToken, data.response.access_token).subscribe(() => {
          // Buscar datos del perfil
          this.loadProfile();
        });
        this.storage.set(this._keyUserId, data.response.user_id).subscribe(() => {});
        // Guardar que esta logueado
        this.isLoggedIn.next(true);
      }

      return data;
    }));
  }

  signInWithEmailAndPasswordInternal(email: string, password: string): Observable<ApiResponse<{ access_token: MIAAccessToken, user: MIAUser }>> {
    const params = {
      email: email,
      password: password
    };
    return this.http.post<ApiResponse<{ access_token: MIAAccessToken, user: MIAUser }>>(this._baseUrlInternal + 'mia-auth/login', params)
    .pipe(map(data => {

      // Verificar si se logueo correctamente
      if (data.success) {
        // Guardar AccessToken
        this.storage.set(this._keyAccessToken, data.response.access_token.access_token).subscribe(() => {});
        this.storage.set(this._keyUserId, data.response.access_token.user_id).subscribe(() => {});
        this.storage.set(this._keyUserData, JSON.stringify(data.response.user)).subscribe(() => {});
        // Guardar que esta logueado
        this.isLoggedIn.next(true);
      }

      return data;
    }));
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<ApiResponse<MIAAccessToken>> {
    const params = {
      grant_type: 'normal',
      app_id: this._apiKey,
      email: email,
      password: password
    };
    return this.http.post<ApiResponse<MIAAccessToken>>(this._baseUrl + 'oauth', params)
    .pipe(map(data => {

      // Verificar si se logueo correctamente
      if (data.success) {
        // Guardar AccessToken
        this.storage.set(this._keyAccessToken, data.response.access_token).subscribe(() => {
          // Buscar datos del perfil
          this.loadProfile();
        });
        this.storage.set(this._keyUserId, data.response.user_id).subscribe(() => {});
        // Guardar que esta logueado
        this.isLoggedIn.next(true);
      }

      return data;
    }));
  }

  protected loadProfile() {
    this.fetchProfile().subscribe(data => {});
  }

  fetchProfile(): Observable<ApiResponse<MIAUser>> {
    // Obtenemos AccessToken
    return this.getAccessToken().pipe(switchMap(accessToken => {
      if (accessToken == null) {
        return;
      }
      return this.requestProfile(accessToken);
    }));
  }

  protected requestProfile(accessToken: string): Observable<ApiResponse<MIAUser>> {
    const params = {
      access_token: accessToken,
      app_id: this._apiKey
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'me', params)
    .pipe(map(data => {
      // Verificar si el AccessToken es incorrecto cerrar sesión
      if (!data.success && data.error && data.error.code == 413) {
        this.signOut();
        window.location.reload();
      }
      // Verificar si fue correcto
      if (data.success) {
        // Guardar datos del usuario en la DB local
        this.storage.set(this._keyUserData, JSON.stringify(data.response)).subscribe(() => {});
        // Guardar datos de perfil
        this.currentUser.next(data.response);
        // Esta logueado
        this.isLoggedIn.next(true);
      }
      // Devolvemos Observable
      return data;
    }));
  }

  registerUserWithFacebook(params): Observable<ApiResponse<any>> {
    // Verificar si tiene foto asignada
    let photo = '';
    if (params.photo) {
      photo = params.photo;
    }
    const postParams = {
      app_id: this._apiKey,
      register_type: 'facebook',
      facebook_id: params.facebookId,
      facebook_access_token: params.facebookToken,
      platform: 2
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'register', postParams);
  }

  registerUser(params): Observable<ApiResponse<any>> {
    // Verificar si tiene foto asignada
    let photo = '';
    if (params.photo) {
      photo = params.photo;
    }
    let phone = '';
    if (params.phone) {
      phone = params.phone;
    }
    const postParams = {
      app_id: this._apiKey,
      register_type: 'normal',
      email: params.email,
      password: params.password,
      firstname: params.firstname,
      lastname: params.lastname,
      photo: photo,
      phone: phone,
      platform: 2
    };
    return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'register', postParams);
  }

  updateUser(params: any): Observable<ApiResponse<MIAUser>> {
    // Obtenemos AccessToken
    return this.getAccessToken().pipe(switchMap(accessToken => {
      if (accessToken == null) {
        return;
      }
      // Asignar APP ID
      params.app_id = this._apiKey;
      params.access_token = accessToken;
      return this.http.post<ApiResponse<MIAUser>>(this._baseUrl + 'update', params);
    }));
  }

  recoveryPass(email: string, newPassword: string): Observable<ApiResponse<boolean>> {
    const params = {
      app_id: this._apiKey,
      email: email,
      password: newPassword,
      platform: 2
    };
    return this.http.post<ApiResponse<boolean>>(this._baseUrl + 'recovery', params);
  }

  signOut() {
    this.storage.delete(this._keyAccessToken).subscribe(() => {});
    this.storage.delete(this._keyUserId).subscribe(() => {});
    this.storage.delete(this._keyUserData).subscribe(() => {});
    this.storage.clear().subscribe(() => {});
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
  }

  saveAccesstoken(accessToken) {
    // Guardar AccessToken
    this.storage.set(this._keyAccessToken, accessToken).subscribe(() => {
      // Buscar datos del perfil
      this.loadProfile();
    });
  }

  /**
   * Devuelve API Key
   */
  getApiKey(): string {
    return this._apiKey;
  }

  getAccessToken(): Observable<string> {
    return this.storage.get(this._keyAccessToken, { type: 'string'});
  }

  getUserID(): Observable<number> {
    return this.storage.get(this._keyUserId, { type: 'number' });
  }

  getUserData(): Observable<MIAUser> {
    return this.storage.get(this._keyUserData, { type: 'string' }).pipe(map(data => JSON.parse(data)));
  }

}
