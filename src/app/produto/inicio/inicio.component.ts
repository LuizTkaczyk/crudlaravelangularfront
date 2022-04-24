import { Component, OnInit, ViewChild, ElementRef, Pipe, AfterContentChecked, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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
export class InicioComponent implements OnInit,AfterContentChecked {
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
  estoqueFinal;
  idVenda;
  id;
  taxaJurosVista;
  taxaJurosPrazo;
  taxaJurosDebito;
  taxaJurosParcela;
  parcelas = 2;
  valor;
  errorBusca = false

  // adicionar debito!!!!!!!!
  selectedOptionPagamento = 'Dinheiro';
  formasPagamento = [
    { name: 'Dinheiro', value: 1 },
    { name: 'PIX', value: 2 },
    { name: 'Cartão débito', value: 3 },
    { name: 'Cartão crédito - à vista', value: 4 },
    { name: 'Cartão crédito - à prazo', value: 5 },
  ];

  numParcelas = [2,3,4,5,6,7,8,9,10,11,12]

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private sharedService: SharedService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.model = this.today;
    this.formulario();
    this.geraCodVenda();
    this.getTaxaJurosCartao();
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
}

  geraCodVenda() {
    this.sharedService.get(Route.CODIGO_VENDA, null).subscribe((data) => {
      this.idVenda = data;
    });
  }

  getTaxaJurosCartao() {
    this.sharedService.get(Route.GET_JUROS).subscribe((data) => {
      this.taxaJurosVista = data.taxaJurosVista;
      this.taxaJurosPrazo = data.taxaJurosPrazo;
      this.taxaJurosDebito = data.taxaJurosDebito;
      this.taxaJurosParcela = data.taxaJurosParcela;
      
    });
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
      //codVenda: new FormControl('', [Validators.required]),

    });
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }

  get f() {
    return this.form?.controls;
  }

  buscar() {
    let codigo = this.buscarCodigo.nativeElement.value;
    if(!codigo){
      this.errorBusca = true;
    }else{
      this.errorBusca = false
      this.sharedService.find(Route.BUSCA_PRODUTO, codigo).subscribe((data) => {
        if(Object.values(data).length == 0){
          this.errorBusca = true;
        }
        this.form.get('nome').setValue(data.nome);
        this.form.get('precoVenda').setValue(data.valorVenda);
        this.estoque = data.quantidade;
        this.id = data.id;
        this.form.get('precoComDesconto').setValue(data.valorVenda);
        this.form.get('precoSemDesconto').setValue(data.valorVenda);
      });
      if (codigo) {
        this.isSearch = true;
      } else {
        return;
      }

    }
  }

  adicionar(item: any) {
    this.calculosFinais();
    this.addProdutosLista();
    this.subQuantidade();

    this.buscarCodigo.nativeElement.value = '';
    this.form.reset();
    this.form.get('quantidade').setValue(1);
    this.form.get('desconto').setValue(0);
    this.model = this.today;
  }

  subQuantidade() {
    let quantidade = {
      produtoId: this.id,
      quantidadeVendida: this.form.get('quantidade').value,
    };

    this.sharedService
      .post(Route.REMOVE_ESTOQUE, quantidade)
      .subscribe((res: any) => {});
  }

  calculosFinais() {
    //soma dos valores sem desconto
    this.somaValorSemDesconto.push(this.quantidade * this.totalSemDesc());
    this.totalSemDesconto = this.somaValorSemDesconto.reduce((a, b) => a + b);

    //soma dos valores com desconto
    this.somaValorComDesconto.push(this.quantidade * this.totalComDesc());
    this.totalComDesconto = this.somaValorComDesconto.reduce((a, b) => a + b);
  
    //total somente de descontos
    this.totalDesconto = this.totalSemDesconto - this.totalComDesconto;
   
  }

  addProdutosLista() {
    this.lista.push({
      codigo: this.buscarCodigo.nativeElement.value,
      nome: this.form.get('nome').value,
      valorVenda: this.form.get('precoVenda').value,
      quantidade: this.quantidade,
      desconto: this.descontoP,
      valorComDesconto:(this.quantidade * this.totalComDesc()).toFixed(2),
      valorSemDesconto:(this.quantidade * this.totalSemDesc()).toFixed(2),
      dataVenda:
        this.model['day'] +
        '/' +
        this.model['month'] +
        '/' +
        this.model['year'],
      totalComDesconto: Number(this.totalComDesconto).toFixed(2),
      totalSemDesconto: Number(this.totalSemDesconto).toFixed(2),
      totalDesconto: Number(this.totalDesconto).toFixed(2),
      idVenda: this.idVenda,
      formaPagamento: this.selectedOptionPagamento,
    });
  }

  finalizar() {
    this.geraCodVenda();
    if (this.lista.length > 0) {
      this.sharedService
        .post(Route.VENDAS, this.lista)
        .subscribe((res: any) => {});
    }
    this.resetaTotais();

  }

  resetaTotais(){
    this.lista = [];
    this.somaValorSemDesconto = [];
    this.somaValorComDesconto = [];
    this.totalDesconto = '';
    this.totalComDesconto = '';
    this.totalSemDesconto = '';
    this.totalDesconto = '';
  }
  
  totalSemDesc(){
   
    if(this.selectedOptionPagamento == 'Dinheiro' || this.selectedOptionPagamento == 'PIX'){
      return this.valor = this.valorVenda;
      
      
    }else if(this.selectedOptionPagamento == 'Cartão crédito - à vista'){
      let total =this.valorVenda;
      let taxaInter = total * (this.taxaJurosVista/100);
      return this.valor = total - taxaInter
      
    }else if(this.selectedOptionPagamento == 'Cartão crédito - à prazo'){
      let total = this.valorVenda;
      let taxaInter = total * (this.taxaJurosPrazo/100) //taxa de intermediação
      let valorParcela = this.precoFinal / this.parcelas; //valor por parcela
      let valorFinal= [];
      for (let index = 0; index < this.parcelas; index++){
        let taxaPorcentagem = this.taxaJurosParcela/100;
        valorFinal.push(valorParcela / (Math.pow((1+(taxaPorcentagem)),index+1)));
      }

      let valor = valorFinal.reduce((soma, valor) => soma + valor);
      return this.valor =  valor - taxaInter;

    }else if(this.selectedOptionPagamento == 'Cartão débito'){
      let total = this.valorVenda;
      let taxaInter = total * (this.taxaJurosDebito/100);
      return this.valor = total - taxaInter
      
    }
    return null;
  }

  totalComDesc(){
    this.valor = this.valor - ((this.valor) * (this.descontoP/100));
    return  this.valor;
  }

  deleteList(index:number, data){
    this.lista.splice(index,1);
  
    //console.log(this.totalSemDesconto)
    //console.log(data.totalComDesconto, data.totalSemDesconto, data.totalDesconto)
  
  }
}