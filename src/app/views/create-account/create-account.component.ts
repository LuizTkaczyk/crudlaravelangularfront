import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  data;
  form :FormGroup;
  constructor(private sharedServie:SharedService, private router:Router) { }


  ngOnInit() {
    this.formulario()
  }

  criarConta(){
    this.sharedServie.post(Route.CREATE_USER, this.form.value).subscribe()
    this.router.navigateByUrl('login');
    
  }

  formulario(){
    this.form = new FormGroup({
      name:new FormControl('',[Validators.required]),
      email:new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

}
