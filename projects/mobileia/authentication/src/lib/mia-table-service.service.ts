import { Injectable } from '@angular/core';
import { MiaAuthHttpService } from './mia-auth-http.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { MIATableModel, ApiPagination } from '@mobileia/core';

@Injectable({
  providedIn: 'root'
})
export class MiaTableService<T> extends MiaAuthHttpService {

  basePathUrl = '';

  constructor(
    protected http: HttpClient,
    protected authService: AuthenticationService,
  ) { 
    super(http, authService);
  }

  fetch(itemId: number): Promise<T> {
    return this.postAuthObjectPro(this.basePathUrl + '/fetch', { id: itemId });
  }

  save(item: T): Promise<boolean> {
    return this.postAuthObjectPro(this.basePathUrl + '/save', item);
  }

  fetchList(params: MIATableModel): Promise<ApiPagination<T>> {
    return this.postAuthObjectPro(this.basePathUrl + '/list', params.toParams());
  }

  remove(itemId: number): Promise<boolean> {
    return this.postAuthObjectPro(this.basePathUrl + '/remove', { id: itemId });
  }
}
