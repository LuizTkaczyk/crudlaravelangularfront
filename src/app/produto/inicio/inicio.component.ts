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

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private sharedService: SharedService,
   
  ) {}

  ngOnInit() {
    this.model = this.today;
    // this.getAll();
    this.formulario();
    this.geraCodVenda();
  }
  
  geraCodVenda(){
    this.sharedService.get(Route.CODIGO_VENDA, null).subscribe((data)=>{
      this.idVenda = data
    })
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
      codVenda:new FormControl('')
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
    this.sharedService.find(Route.BUSCA_PRODUTO, codigo).subscribe((data)=>{
      this.form.get('nome').setValue(data.nome);
      this.form.get('precoVenda').setValue(data.valorVenda);
      this.estoque = data.quantidade;
      this.id = data.id;
      this.form.get('precoComDesconto').setValue(data.valorVenda);
      this.form.get('precoSemDesconto').setValue(data.valorVenda);
    })
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
    console.log(this.id)

    this.buscarCodigo.nativeElement.value = '';
    this.form.reset();
    this.form.get('quantidade').setValue(1);
    this.form.get('desconto').setValue(0);
    this.model = this.today;
  }

  subQuantidade(){
    let quantidade = ({
      produtoId:this.id,
      quantidadeVendida:this.form.get('quantidade').value
    })
   

    this.sharedService.post(Route.REMOVE_ESTOQUE, quantidade).subscribe((res:any)=>{})
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
      idVenda:this.idVenda

    });
  }

  finalizar() {
    this.geraCodVenda();
    if(this.lista.length > 0){
      this.sharedService.post(Route.VENDAS,this.lista).subscribe((res: any) => {
      });
    }else{
      return
    }
    this.lista = [];
  }
}
