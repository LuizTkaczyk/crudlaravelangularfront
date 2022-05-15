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
  @ViewChild('codVenda') codRelatorio: ElementRef
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
      console.log(data)
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
  keyDescOrder (){
    return null
  
  }

  openRelatorio(value){
    this.getTotais(value)
  }

  teste(){
    return null;
  }
}
