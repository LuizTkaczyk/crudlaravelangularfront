import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../produto.service';
import { AccountService } from '../../shared/account.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @ViewChild('exitApp') deleteModal;
  exitApplication: BsModalRef;
  constructor(private produtoService: ProdutoService, private accountService:AccountService, private router:Router, private modalService: BsModalService,
  ) {}

  ngOnInit() {} 

  logout() {
    this.accountService.removeToken();
    this.router.navigate(['login']);
    
  }

  exit() {
    this.exitApplication = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  onConfirmExit() {
    this.logout()
    this.exitApplication.hide();
  }

  onDeclineExit() {
    this.exitApplication.hide();
  }

}
