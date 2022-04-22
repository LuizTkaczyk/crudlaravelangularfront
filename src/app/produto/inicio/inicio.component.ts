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
  estoqueFinal;
  idVenda;
  id;
  taxaJurosVista;
  taxaJurosPrazo;
  taxaJurosDebito;
  taxaJurosParcela;
  parcelas = 1;
  valor;

  // adicionar debito!!!!!!!!
  selectedOptionPagamento = 'Dinheiro';
  formasPagamento = [
    { name: 'Dinheiro', value: 1 },
    { name: 'PIX', value: 2 },
    { name: 'Cartão débito', value: 3 },
    { name: 'Cartão crédito - à vista', value: 4 },
    { name: 'Cartão crédito - à prazo', value: 5 },
  ];

  numParcelas = [1,2,3,4,5,6,7,8,9,10,11,12]

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.model = this.today;
    this.formulario();
    this.geraCodVenda();
    this.getTaxaJurosCartao();
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
      codVenda: new FormControl(''),
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
    this.sharedService.find(Route.BUSCA_PRODUTO, codigo).subscribe((data) => {
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
    if(this.selectedOptionPagamento == 'Dinheiro' || this.selectedOptionPagamento == 'PIX'){
      
      //soma dos valores com desconto
      this.somaValorComDesconto.push(this.quantidade * this.valorVenda -this.quantidade * this.valorVenda * (this.descontoP / 100));
      this.totalComDesconto = this.somaValorComDesconto.reduce((a, b) => a + b);
  
      //soma dos valores sem desconto
      this.somaValorSemDesconto.push(Number(this.valorVenda * this.quantidade));
      this.totalSemDesconto = this.somaValorSemDesconto.reduce((a, b) => a + b);
  
      this.totalDesconto = this.totalSemDesconto - this.totalComDesconto;

    }else if(this.selectedOptionPagamento == 'Cartão crédito - à vista'){
       this.somaValorComDesconto.push(this.quantidade * this.valorVenda -this.quantidade * this.valorVenda * (this.descontoP / 100));
      this.totalComDesconto = this.somaValorComDesconto.reduce((a, b) => a + b) - this.taxaJurosVista;
  
      //soma dos valores sem desconto
      this.somaValorSemDesconto.push(Number(this.valorVenda * this.quantidade));
      this.totalSemDesconto = this.somaValorSemDesconto.reduce((a, b) => a + b) - this.taxaJurosVista;
  
      this.totalDesconto = this.totalSemDesconto - this.totalComDesconto;

    }else if(this.selectedOptionPagamento == 'Cartão crédito - à prazo'){
     
    }else if(this.selectedOptionPagamento == 'Cartão débito'){
     
    }
  }

  addProdutosLista() {
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
      dataVenda:
        this.model['day'] +
        '/' +
        this.model['month'] +
        '/' +
        this.model['year'],
      totalComDesconto: this.totalComDesconto,
      totalSemDesconto: this.totalSemDesconto,
      totalDesconto: this.totalDesconto,
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
     this.valor = this.valorVenda * this.quantidade;
      
      
    }else if(this.selectedOptionPagamento == 'Cartão crédito - à vista'){
      let total = (this.valorVenda * this.quantidade);
      let desconto = total * (this.taxaJurosVista/100);
      this.valor = total - desconto
      
    }else if(this.selectedOptionPagamento == 'Cartão crédito - à prazo'){
      // let taxaPorcentagem = this.taxaJurosParcela/100
      // let taxaParcela = (1+taxaPorcentagem);
      // console.log(taxaParcela);

      // this.valor = this.valorVenda * this.quantidade;
      
    }else if(this.selectedOptionPagamento == 'Cartão débito'){
       let total = (this.valorVenda * this.quantidade);
      let desconto = total * (this.taxaJurosDebito/100);
      this.valor = total - desconto
      
    }
    return this.valor
  }

  teste(){
    let valorComTaxa = this.precoFinal - (this.precoFinal*(this.taxaJurosPrazo/100))

    let valorParcela = this.precoFinal / this.parcelas; //valor por parcela
    
    let taxaPorcentagem = this.taxaJurosParcela/100 //taxa de porcentagem

    let taxaParcela = Math.pow((1+taxaPorcentagem), this.parcelas); //taxa com o montante calculado
    
    let parcelaJuros = valorParcela / taxaParcela;



    console.log(taxaParcela);
  }
}