import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ProdutoRoutingModule } from './produto-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PaginatorBr } from './paginator-br';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
//import { HomeComponent } from './home/home.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import ptBr from '@angular/common/locales/pt';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InicioComponent } from './inicio/inicio.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateFormat } from './dateFormatInicio/CustomDateFormat';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { ConfigsComponent } from './configs/configs.component';
import { CreateAccountComponent } from './create-account/create-account.component';

import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    InicioComponent,
    RelatorioComponent,
    ConfigsComponent,
    CreateAccountComponent
  ],
  imports: [
CommonModule,
    ProdutoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MatExpansionModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    Ng2SearchPipeModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgbModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}), //REMOVE O AVISO DO NGMODEL NO FORM CONTROL
    NgxMaskModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: MatPaginatorIntl, useClass: PaginatorBr },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: CustomDateFormat },
  ],
})
export class ProdutoModule {}
