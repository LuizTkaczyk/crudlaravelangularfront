import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from './users';
import { AccountService } from '../../shared/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  usuario: Users = new Users();

  constructor(
    private accountService:AccountService,
    private router :Router
  ) {}

  ngOnInit(): void {}

  async entrar() {
    try{
      const result = await this.accountService.login(this.usuario);
      console.log('Login efetuado:' + result);
      this.router.navigate(['']);
    }catch(error){
      console.log(error);
    }
  }
  
}
