import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  valorCompra:number;
  lucro: number;
  valorVenda: number = 0;
  valorTotal: number;
  valorTotalCompra: number;
  valorTotalVenda: number;
  quantidade: number;
  codProduto;

  form: FormGroup;

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.randomCode();
    this.formulario();
  }

  formulario(){
    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorCompra: new FormControl('', [Validators.required, Validators.pattern("^[0-9-.]*$")]),
      lucro: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorVenda: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      valorTotalCompra: new FormControl(''),
      valorTotalVenda: new FormControl(''),
      codProduto:  new FormControl('')
    })
  }

  limpa() {
    this.form.reset()
  }

  randomCode() {
    this.codProduto = Math.floor(100000 + Math.random() * 999999);
  }

  get f() {
    return this.form?.controls;
  }

  submit() {
    this.form.value.valorVenda = ((this.lucro / 100) * (this.valorCompra)) + this.valorCompra;
    this.form.value.valorTotalCompra = this.quantidade * this.valorCompra;
    this.form.value.valorTotalVenda = this.quantidade * (((this.lucro / 100) * (this.valorCompra)) + this.valorCompra);
    this.form.value.codProduto = this.codProduto;

    this.sharedService.post(Route.CRIAR_PRODUTO ,this.form.value).subscribe(res => {
      //console.log('Pessoa criada com sucesso');
      this.router.navigateByUrl('index');
    })
  }

  valor(event){
    let a  = this.valorCompra.toString();
    const replaced1 = a.replace(',', '.');
    console.log(replaced1); 
    this.valorCompra = Number(replaced1);
    
  }

  valorTotalCompras(){
    return Number(this.valorCompra * this.quantidade);
  }

  valorFinalUnidade(){
    return ((this.lucro / 100) * Number(this.valorCompra)) + Number(this.valorCompra);
  }

  valorTotalVendas(){
    return this.quantidade * (((this.lucro / 100) * Number(this.valorCompra)) + Number(this.valorCompra));
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

}
