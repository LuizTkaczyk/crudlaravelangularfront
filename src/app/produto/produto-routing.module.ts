import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InicioComponent } from './inicio/inicio.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { ConfigsComponent } from './configs/configs.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  //{ path: 'produto', redirectTo: 'produto/index', pathMatch: 'full' },
  { path: 'home', component: InicioComponent },
  { path: 'home/index', component: IndexComponent },
  { path: 'home/create', component: CreateComponent },
  { path: 'produto/edit/:idProduto', component: EditComponent },
  { path: 'home/relatorio', component: RelatorioComponent },
  { path: 'home/configuracao/:id?', component: ConfigsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class ProdutoRoutingModule {}
