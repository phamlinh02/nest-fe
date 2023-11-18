import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {HomeComponent} from "./home/home.component";
import {FooterComponent} from "./footer/footer.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {AccountInfoComponent} from "./account-info/account-info.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ContactComponent} from "./contact/contact.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {PurchaseGuideComponent} from "./purchase-guide/purchase-guide.component";
import {TermServiceComponent} from "./term-service/term-service.component";
import {CartComponent} from "./cart/cart.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {CompareItemComponent} from "./compare-item/compare-item.component";
import {ShopFilterComponent} from "./shop-filter/shop-filter.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {FavoriteComponent} from "./favorite/favorite.component";
import {ShopDealsComponent} from "./shop-grid-right/shop-deals.component";
import {LoadingPageComponent} from "./loading-page/loading-page.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    AboutUsComponent,
    AccountInfoComponent,
    ErrorPageComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    PurchaseGuideComponent,
    TermServiceComponent,
    CartComponent,
    CheckoutComponent,
    CompareItemComponent,
    ShopFilterComponent,
    InvoiceComponent,
    ProductDetailComponent,
    FavoriteComponent,
    ShopDealsComponent,
    LoadingPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule,
    ],
  providers: [HttpClient, MessageService],
    exports: [
        HeaderComponent,
        FooterComponent,
        LoadingPageComponent
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
