import { Component, OnInit } from '@angular/core';
import { Produto } from '../produto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: number;
  produto: Produto;
  form: FormGroup;
  valorCompra:number;
  lucro:number;
  valorVenda = 0;
  valorTotal:number;
  valorTotalCompra;
  valorTotalVenda:number;
  quantidade:number;


  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private shareService:SharedService
  ) {
  }

  getValorCompra(getValorCompra){
    this.valorTotalCompra = getValorCompra
  }

  addQuantidade(quantidade){
    this.valorTotalCompra = quantidade * this.form.value.valorCompra;   
    this.valorTotalVenda = quantidade * Number(this.valorVenda)
    
  }

  addValor(valor){
    this.valorTotalCompra = valor * this.form.value.quantidade;
    this.valorVenda = ((Number(this.form.value.lucro)/100) * valor ) + valor;
    this.valorTotalVenda = (Number(this.form.value.quantidade) * valor) * Number(this.form.value.lucro/100) + Number(this.valorTotalCompra)

  }

  calcLucro(lucro){
    this.valorVenda = ((lucro/100) * this.form.value.valorCompra);
    this.valorVenda = Number(this.form.value.valorCompra) + Number(this.valorVenda);
    this.valorTotalVenda = Number(this.form.value.quantidade) * Number(this.valorVenda)

  }
  
  
  ngOnInit(): void {
    this.id = this.route.snapshot.params['idProduto'];
    this.shareService.find(Route.FIND,this.id).subscribe((data: Produto) => {
      console.log(data)
      this.form.get('nome').setValue(data.nome);
      this.form.get('quantidade').setValue(data.quantidade);
      this.form.get('valorCompra').setValue(data.valorCompra);
      this.form.get('lucro').setValue(data.valorLucro);
      this.form.get('valorVenda').setValue(data.valorVenda);
      this.form.get('valorTotalCompra').setValue(data.valorTotalCompra);
      this.form.get('valorTotalVenda').setValue(data.valorTotalVenda);
      this.produto = data
    });



    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁáÀàÉéÈèÍíÌìÓóÒòÚúÙùÑñüÜ0-9 \-\']+')]),
      quantidade: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorCompra: new FormControl('', [Validators.required, Validators.pattern("^[0-9-.]*$")]),
      lucro: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorVenda: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorTotalCompra: new FormControl(''),
      valorTotalVenda: new FormControl('')
    })
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.form.value.valorVenda =  this.valorVenda;
    this.form.value.valorTotalCompra = this.valorTotalCompra;
    this.form.value.valorTotalVenda = this.valorTotalVenda;
   
    this.shareService.update(Route.EDITAR_PRODUTO,this.id,this.form.value).subscribe(res => {
      //console.log(res);
      this.router.navigateByUrl('home/index');
    })

    console.log(this.form.value);
  }
}
