import { HttpClient } from "@angular/common/http";
import { ApiResponse, MiaHttpService } from "@mobileia/core";
import { AuthenticationService } from "./authentication.service";

export class MiaAuthHttpService extends MiaHttpService {

    protected _httpReference: HttpClient;
    protected _authServiceReference: AuthenticationService;

    constructor(http: HttpClient,
        authService: AuthenticationService) {
        super(http);
        this._httpReference = http;
        this._authServiceReference = authService;
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