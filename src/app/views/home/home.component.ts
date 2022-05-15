import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../produto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
  
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {}

  isLogin() {}
}
