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
  taxaJuroPrazo;
  id;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.juros();
    this.sharedService.get(Route.GET_JUROS).subscribe((data) => {
      this.taxaJuroVista = data.taxaJurosVista;
      this.taxaJuroPrazo = data.taxaJurosPrazo
    });
  }

  juros() {
    this.form = new FormGroup({
      taxaJurosVista: new FormControl(''),
      taxaJurosPrazo: new FormControl(''),
    });
  }

  submit() {
    this.sharedService
      .post(Route.TAXA_JUROS,this.form.value)
      .subscribe((data) => {});
    console.log(this.form.value);
  }
}
