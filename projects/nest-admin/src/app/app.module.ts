import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ErrorComponent} from "./error-page/error.component";
import {HomeComponent} from "./home/home.component";
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {CategoriesComponent} from "./categories/categories.component";
import {AccountComponent, AccountDetailComponent,AddAccountComponent} from "./account";
import {OrderComponent, OrderDetailComponent} from "./order";
import {ProductDetailComponent, ProductComponent} from "./product";
import {RateComponent} from "./rate/rate.component";
import {LoginComponent} from "./account/login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    CategoriesComponent,
    AccountDetailComponent,
    AccountComponent,
    OrderDetailComponent,
    OrderComponent,
    ProductDetailComponent,
    ProductComponent,
    RateComponent,
    LoginComponent,
    AddAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
