import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProdutoModule } from './views/produto.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { HomeComponent } from './views/home/home.component';
import { CustomDateFormat } from './views/dateFormatInicio/CustomDateFormat';
import { LoginComponent } from './views/login/login.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationComponent } from './views/authentication/authentication.component';
import { AuthInterceptor } from './shared/auth.interceptor';



@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, AuthenticationComponent],
  imports: [
BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ProdutoModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    //Router
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateFormat},
    {provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true}
   
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
