import { Component, OnInit, ViewChild, ElementRef, Pipe } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Produto } from '../produto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  @ViewChild('buscarCodigo') buscarCodigo: ElementRef;
  @ViewChild('desconto') desconto: ElementRef;
  @ViewChild('data') data: ElementRef;

  public searchText: Produto[] = [];
  model;
  form: FormGroup;
  estoque;
  isSearch: boolean = false;
  lista: any[] = [];
  valorVenda = 0;
  valorDesconto;
  quantidade = 1;
  descontoP = 0;
  precoFinal;
  dataVenda;
  somaValorComDesconto = [];
  somaValorSemDesconto = [];
  totalComDesconto;
  totalSemDesconto;
  totalDesconto;

  teste;

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private sharedService: SharedService,
   
  ) {}

  ngOnInit() {
    this.model = this.today;
    this.getAll();
    this.formulario();
  }

  formulario() {
    this.form = new FormGroup({
      nome: new FormControl('', Validators.required),
      precoVenda: new FormControl('', Validators.required),
      quantidade: new FormControl('', [Validators.required]),
      desconto: new FormControl(''),
      precoComDesconto: new FormControl(''),
      precoSemDesconto: new FormControl(''),
      dataVenda: new FormControl('', [Validators.required]),
    });
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }

  get f() {
    return this.form?.controls;
  }

  getAll() {
    this.sharedService.get(Route.TODOS_PRODUTOS, null).subscribe((data: Produto[]) => {
      this.searchText = data;
    });
  }

  buscar() {
    this.form.get('quantidade').setValue(1);
    let hasCode = this.buscarCodigo.nativeElement.value;
    let busca = this.form;
    let quantidadeEstoque;
    let valor;
    

    this.searchText.forEach(function (value) {
      if (value.codProduto == hasCode) {
        busca.get('nome').setValue(value.nome);
        busca.get('precoVenda').setValue(value.valorVenda);
        busca.get('precoComDesconto').setValue(value.valorVenda);
        busca.get('precoSemDesconto').setValue(value.valorVenda);
        quantidadeEstoque = value.quantidade;
        valor = Number(value.valorVenda);
      }
      if (value.codProduto != hasCode) {
        return;
      }
    });


    this.valorVenda = Number(valor);
    this.estoque = quantidadeEstoque;
    if (this.estoque > quantidadeEstoque) {
      console.log('menor');
    }
    if (hasCode) {
      this.isSearch = true;
    } else {
      return;
    }
  }

  adicionar(item: any) {
    this.calculosFinais();
    this.addProdutosLista();

    this.buscarCodigo.nativeElement.value = '';
    this.form.reset();
    this.form.get('quantidade').setValue(1);
    this.form.get('desconto').setValue(0);
    this.model = this.today;
  }

  calculosFinais(){
    //soma dos valores com desconto
    this.somaValorComDesconto.push(this.quantidade * this.valorVenda - this.quantidade * this.valorVenda * (this.descontoP / 100));
    this.totalComDesconto = this.somaValorComDesconto.reduce((a, b) => (a + b));
    
    //soma dos valores sem desconto
    this.somaValorSemDesconto.push(Number(this.valorVenda * this.quantidade))
    this.totalSemDesconto = this.somaValorSemDesconto.reduce((a, b) => (a + b));

    this.totalDesconto = this.totalSemDesconto - this.totalComDesconto;
  }

  addProdutosLista(){
    this.lista.push({
      codigo: this.buscarCodigo.nativeElement.value,
      nome: this.form.get('nome').value,
      valorVenda: this.form.get('precoVenda').value,
      quantidade: this.quantidade,
      desconto: this.descontoP,
      valorComDesconto:
        this.quantidade * this.valorVenda -
        this.quantidade * this.valorVenda * (this.descontoP / 100),
      valorSemDesconto: this.valorVenda * this.quantidade,
      dataVenda:this.model['day'] +'/' +this.model['month'] +'/' +this.model['year'],
      totalComDesconto: this.totalComDesconto,
      totalSemDesconto:this.totalSemDesconto,
      totalDesconto:this.totalDesconto,

    });
  }

  finalizar() {
    if(this.lista.length > 0){
      this.sharedService.create(Route.VENDAS,this.lista).subscribe((res: any) => {
      });
    }else{
      return
    }
    this.lista = [];
  }
}
