import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  relatorio;
  objectKeys = Object.keys;
  
  constructor(private sharedServie:SharedService) { }
  
  ngOnInit() {
    this.getRelatorios()
  }
  
  getRelatorios(){
    this.sharedServie.get(Route.RELATORIOS).subscribe((data)=>{
      this.relatorio = data;
    })
  }

  //ordena os produtos de acordo com a data
  keyDescOrder = (a: KeyValue<any,any>, b: KeyValue<any,any>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }
}
