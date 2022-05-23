import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from './users';
import { AccountService } from '../../shared/account.service';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  usuario: Users = new Users();
  form : FormGroup;

  data;
  constructor(
    private accountService:AccountService,
    private router :Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.formLogin();
  }

  formLogin(){
    this.form = new FormGroup({
      name : new FormControl('', [Validators.required]),
      password : new FormControl('', [Validators.required])
    })
  }

  login() {
    try{
      this.sharedService.post(Route.LOGIN, this.form.value).subscribe((data)=>{
        const token = data.access_token;
        this.accountService.login(token);
        this.router.navigate(['home']);
      });

    }catch(error){
      console.log(error);
      
    }
  }
  
}
