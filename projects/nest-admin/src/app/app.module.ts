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
import {AccountComponent, AccountDetailComponent,AddAccountComponent, RolesComponent, ForgetComponent, AccountInfoComponent, ChangePasswordComponent} from "./account";
import {OrderComponent, OrderDetailComponent} from "./order";
import {ProductDetailComponent, ProductComponent, AddProductComponent} from "./product";
import { AuthorityComponent } from './authority/authority.component';
import {RateComponent, RateDetailComponent} from "./rate";
import {LoginComponent} from "./account/login/login.component";
import {PaginatorModule} from "primeng/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoadingPageComponent} from "./loading-page/loading-page.component";
import { StatisticProductComponent } from './statistical';
import {ChartModule} from "primeng/chart";

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
    AddAccountComponent,
    AddProductComponent,
    RolesComponent,
    LoadingPageComponent,
    ForgetComponent,
    AccountInfoComponent,
    ChangePasswordComponent,
    RateDetailComponent,
    StatisticProductComponent,
    AuthorityComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PaginatorModule,
        BrowserAnimationsModule,
        ChartModule
    ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
