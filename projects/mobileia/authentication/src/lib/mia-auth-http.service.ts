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

    public postAuthObject(url: string, params: any): Observable<ApiResponse<any>> {
        return this._authServiceReference.getAccessToken().pipe(switchMap(token => {
            params.access_token = token;
            return this.postObject(url, params);
        }));
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