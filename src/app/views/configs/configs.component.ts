import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { Route } from '../../app-const';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css'],
})
export class ConfigsComponent implements OnInit {
  form: FormGroup;
  taxaJuroVista;
  taxaJuroDebito;
  taxaJuroPrazo;
  taxaJuroParcela;
  id = 0;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.juros();
    this.sharedService.get(Route.GET_JUROS).subscribe((data) => {
      if(data){
        this.id = data.id;
        this.taxaJuroVista = data.taxaJurosVista;
        this.taxaJuroPrazo = data.taxaJurosPrazo;
        this.taxaJuroDebito = data.taxaJurosDebito
        this.taxaJuroParcela = data.taxaJurosParcela;
      }
    });
  }

  juros() {
    this.form = new FormGroup({
      taxaJurosVista: new FormControl(''),
      taxaJurosPrazo: new FormControl(''),
      taxaJurosDebito: new FormControl(''),
      taxaJurosParcela :new FormControl('')
    });
  }

  submit() {
    this.sharedService
      .update(Route.TAXA_JUROS,this.id,this.form.value)
      .subscribe((data) => {});
  }
}
