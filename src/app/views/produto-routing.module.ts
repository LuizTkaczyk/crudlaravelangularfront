import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { ConfigsComponent } from './configs/configs.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AuthGuard } from '../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'index', component: IndexComponent },
      { path: 'create', component: CreateComponent },
      { path: 'produto/edit/:idProduto', component: EditComponent },
      { path: 'relatorio', component: RelatorioComponent },
      { path: 'configuracao/:id?', component: ConfigsComponent },
    ],
    canActivate:[AuthGuard]
  },
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component:LoginComponent},
      { path: 'create-account', component:CreateAccountComponent}
    ],
  },

  // { path: '', component: LoginComponent },
  // { path: 'login',component:LoginComponent },
  // { path: 'home', component: InicioComponent },
  // { path: 'home/index', component: IndexComponent },
  // { path: 'home/create', component: CreateComponent },
  // { path: 'produto/edit/:idProduto', component: EditComponent },
  // { path: 'home/relatorio', component: RelatorioComponent },
  // { path: 'home/configuracao/:id?', component: ConfigsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  
exports: [RouterModule],
})
export class ProdutoRoutingModule {}
