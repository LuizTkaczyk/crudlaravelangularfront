import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorBr extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Itens por página';
    this.nextPageLabel = 'Próxima página';
    this.previousPageLabel = 'Página anterior';
    this.lastPageLabel = 'Última página';
    this.firstPageLabel = 'Primeira página';
  }
}
