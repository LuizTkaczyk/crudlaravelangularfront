import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  @ViewChild('teste') codRelatorio: ElementRef
  relatorio;
  objectKeys = Object.keys;
  totalSemDesconto;
  totalComDesconto;
  totalDesconto;
  
  constructor(private sharedServie:SharedService) { }
  
  ngOnInit() {
    this.getRelatorios();
    //this.getTotais();
  }
  
  getRelatorios(){
    this.sharedServie.get(Route.RELATORIOS).subscribe((data)=>{
      this.relatorio = data;
    
     
    })
  }

  getTotais(idRelatorio){
    this.sharedServie.find(Route.GET_TOTAIS, idRelatorio).subscribe((data)=>{
      this.totalComDesconto = data.totalComDesconto;
      this.totalSemDesconto = data.totalSemDesconto;
      this.totalDesconto = data.totalDesconto;
    })
  }

  //ordena os produtos de acordo com a data
  keyDescOrder = (a: KeyValue<any,any>, b: KeyValue<any,any>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  teste(value){
    this.getTotais(value)
  }
}
