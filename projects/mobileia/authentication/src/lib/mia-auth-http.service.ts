import { HttpClient } from "@angular/common/http";
import { ApiResponse, MiaHttpService } from "@mobileia/core";
import { AuthenticationService } from "./authentication.service";
import { forkJoin, Observable, merge, bindCallback, pipe } from "rxjs";
import { switchMap } from 'rxjs/operators';

export class MiaAuthHttpService extends MiaHttpService {

    protected _httpReference: HttpClient;
    protected _authServiceReference: AuthenticationService;

    constructor(http: HttpClient,
        authService: AuthenticationService) {
        super(http);
        this._httpReference = http;
        this._authServiceReference = authService;
    }

    public postAuthObjectPro(url: string, params: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.postAuthObject(url, params).toPromise().then(result => {
              if (result.success) {
                resolve(result.response);
              } else {
                reject(result.error);
              }
            }).catch(error => {
              reject(error);
            });
        });
    }

    public postAuthObject(url: string, params: any): Observable<ApiResponse<any>> {
        return this._authServiceReference.getAccessToken().pipe(switchMap(token => {
            params.access_token = token;
            return this.postObject(url, params);
        }));
    }

    public postAuthArrayPro(url: string, params: any): Promise<[any]> {
        return new Promise<any>((resolve, reject) => {
            this.postAuthArray(url, params).toPromise().then(result => {
              if (result.success) {
                resolve(result.response);
              } else {
                reject(result.error);
              }
            }).catch(error => {
              reject(error);
            });
        });
    }

    public postAuthArray(url: string, params: any): Observable<ApiResponse<[any]>> {
        return this._authServiceReference.getAccessToken().pipe(switchMap(token => {
            params.access_token = token;
            return this.postArray(url, params);
        }));
    }

    public requestAuthObject(url: string, params: any, callback: (data: any) => void) {
        this._authServiceReference.getAccessToken().subscribe(token => {
            params.access_token = token;
            this.requestObject(url, params, callback);
        });
    }

    public requestAuthArray(url: string, params: any, callback: (data: [any]) => void) {
        this._authServiceReference.getAccessToken().subscribe(token => {
            params.access_token = token;
            this.requestArray(url, params, callback);
        });
    }
}