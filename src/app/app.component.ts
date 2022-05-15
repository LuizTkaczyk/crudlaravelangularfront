import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Crud com angular e laravel';

  showMenu:boolean =false;

  constructor(){}

  ngOnInit(){
    
  }
}
