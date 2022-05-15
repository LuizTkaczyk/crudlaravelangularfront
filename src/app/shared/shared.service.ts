import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  apiURL = environment.api;


  constructor(private httpService: HttpClient) {}

  // seviço compartilhado que retorna todos os dados do banco de dados

  get(route): Observable<any> {
    return this.httpService.get(this.apiURL +`${route}`);
  }

  post(route, data):Observable<any>{
    return this.httpService.post(this.apiURL +`${route}`, data);
  }

  postWithId(route, id, data):Observable<any>{
    return this.httpService.post(this.apiURL +`${route}`+ `${id}`, data);
  }

  update(route, id, data):Observable<any>{
    let routeApi = this.apiURL + route + `${id}`;
    return this.httpService.put(routeApi , data);
  }
  
  delete(route, id):Observable<any>{
    let routeApi = this.apiURL +`${route}` + `${id}`
    return this.httpService.request('delete', routeApi);
  }

  find(route, id):Observable<any>{
    return this.httpService.get(this.apiURL+`${route}` + `${id}`)
  }

  getPaginate(route, page, perpage):Observable<any>{
    const params = new HttpParams({
      fromObject:{page, perpage}
    })
    return this.httpService.get(this.apiURL+`${route}`, {params:params ? params : null})
  }

}