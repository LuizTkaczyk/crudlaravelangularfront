import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

constructor() { }

  login(token){
    window.localStorage.setItem('token', token);
  }

  removeToken(){
    localStorage.removeItem('token');
  }

  createAccout(account:any){
    // return new Promise((resolve)=>{
    //   resolve(true)
    // })
  }

}
