import { Component, OnInit, ViewChild } from '@angular/core';
import { Produto } from '../produto';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Route } from '../../app-const';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class IndexComponent implements OnInit {

  searchProdutos: Produto[] = [];
  produtos: Produto[] = [];
  panelOpenState = false;
  deleteModalRef: BsModalRef;
  searchText:string = null;

  private _unsubscribeAll: Subject<any>;
  @ViewChild('deleteModal') deleteModal;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false;
  totalRows = 1;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isSearch = false;
  produtoSelecionado: Produto;
  constructor(
    private modalService: BsModalService,
    private sharedService : SharedService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getValues();
  }

  getValues() {
    this.sharedService
      .getPaginate(Route.PAGINATE_PRODUTOS,this.currentPage, this.perPage).subscribe((data: Produto[]) => {
        //console.log(data)
        setTimeout(() => {
          this.isLoading = true;
          this.paginator.pageIndex = data['current_page'];
          this.paginator.length = data['total'];
          this.produtos = data['data'];
        });
      });
  }

  getAll(){
    this.sharedService.get(Route.TODOS_PRODUTOS).subscribe((data :Produto[]) => {
      this.searchProdutos = data
      //console.log(this.searchProdutos)
    })
  }

  pageChanged(event: PageEvent) {
    this.perPage = event.pageSize; // items por página
    this.currentPage = event.pageIndex; //pagina atual
    this.getValues();
  }

  openCloseOptions() {
    this.panelOpenState = !this.panelOpenState;
    console.log(this.panelOpenState);
  }

  deleteProduto(id) {
    this.sharedService.delete(Route.DELETE_PRODUTO,id).subscribe((res) => {
      this.produtos = this.produtos.filter((item) => item.id !== id);
      //console.log('Pessoa deletada com sucesso!');
    });
  }

  onDelete(produto) {
    this.produtoSelecionado = produto;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  onConfirmDelete() {
    this.deleteProduto(this.produtoSelecionado);
    this.deleteModalRef.hide();
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }

  search(value){
    this.searchText = value;
    if(this.searchText == ''){
      this.isSearch = false;
      return
    }
    this.isSearch = true
   
  }

  // tstestes
}
