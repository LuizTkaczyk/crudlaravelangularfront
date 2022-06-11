import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
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
  relatorioIndividual;
  mesRelatorio = 'Escolha um mês';
  mes;
  mesesAno = [
    {name :'Escolha um mês', value:0},
    {name :'Janeiro', value:1},
    {name :'Fevereiro', value:2},
    {name :'Março', value:3},
    {name :'Abril', value:4},
    {name :'Maio', value:5},
    {name :'Junho', value:6},
    {name :'Julho', value:7},
    {name :'Agosto', value:8},
    {name :'Setembro', value:9},
    {name :'Outubro', value:10},
    {name :'Novembro', value:11},
    {name :'Dezembro', value:12},
  ]
  constructor(private sharedServie:SharedService) { }
 
  
  ngOnInit() {
    this.getRelatorios();
  }

  
  getRelatorios(){
    this.sharedServie.get(Route.RELATORIOS).subscribe((data)=>{
      this.relatorio = data;
      //console.log(data);
      
    })
  }

  getRelatorioVenda(venda){
    this.sharedServie.find(Route.RELATORIO_INDIVIDUAL,venda).subscribe((data)=>{
      this.relatorioIndividual = data;
      
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
    this.getRelatorioVenda(value);
    
  }

  mesDoAno(mes){
    
    switch (mes){
      case 'Escolha um mês':
        this.mes = 0;
        break;
      case 'Janeiro':
        this.mes = 1;
        break;
      case 'Fevereiro':
        this.mes = 2;
        break;
      case 'Março':
        this.mes = 3;
        break;
      case 'Abril':
        this.mes = 4;
        break;
      case 'Maio':
        this.mes = 5;
        break;
      case 'Junho':
        this.mes = 6;
        break;
      case 'Julho':
        this.mes = 7;
        break;
      case 'Agosto':
        this.mes = 8;
        break;
      case 'Setembro':
        this.mes = 9;
        break;
      case 'Outubro':
        this.mes = 10;
        break;
      case 'Novembro':
        this.mes = 11;
        break;
      case 'Dezembro':
        this.mes = 12;
        break;
    }
    console.log(this.mes);
    this.sharedServie.find(Route.RELATORIO_MENSAL, this.mes).subscribe((data)=>{
      console.log(data);
      
    })
  }
}
