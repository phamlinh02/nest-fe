import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {paths} from "./const";
import {AboutUsComponent} from "./about-us/about-us.component";
import {AccountInfoComponent} from "./account-info/account-info.component";
import {CartComponent} from "./cart/cart.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {CompareItemComponent} from "./compare-item/compare-item.component";
import {ContactComponent} from "./contact/contact.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {FavoriteComponent} from "./favorite/favorite.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {LoginComponent} from "./login/login.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {PurchaseGuideComponent} from "./purchase-guide/purchase-guide.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ShopFilterComponent} from "./shop-filter/shop-filter.component";
import {ShopDealsComponent} from "./shop-grid-right/shop-deals.component";
import {TermServiceComponent} from "./term-service/term-service.component";
import { AllProductComponent } from './all-product/all-product.component';

const routes: Routes = [
  {
    path: paths.home,
    component: HomeComponent
  },
  {
    path: paths.aboutUs,
    component: AboutUsComponent
  },
  {
    path: paths.accountInfo,
    component: AccountInfoComponent
  },
  {
    path: paths.cart,
    component: CartComponent
  },
  {
    path: paths.checkout,
    component: CheckoutComponent
  },
  {
    path: paths.compareItem,
    component: CompareItemComponent
  },
  {
    path: paths.contact,
    component: ContactComponent
  },
  {
    path: paths.errorPage,
    component: ErrorPageComponent
  },
  {
    path: paths.favorite,
    component: FavoriteComponent
  },
  {
    path: paths.forgotPass,
    component: ForgetPasswordComponent
  },
  {
    path: paths.invoice + '/:slug',
    component: InvoiceComponent
  },
  {
    path: paths.login,
    component: LoginComponent
  },
  {
    path: paths.privacyPolicy,
    component: PrivacyPolicyComponent
  },
  {
    path: `${paths.productDetail}/:id`,
    component: ProductDetailComponent
  },
  {
    path: paths.purchaseGuide,
    component: PurchaseGuideComponent
  },
  {
    path: paths.register,
    component: RegisterComponent
  },
  {
    path: paths.resetPass,
    component: ResetPasswordComponent
  },
  {
    path: `${paths.shopFilter}/search/:productName`,
    component: ShopFilterComponent
  },
  {
    path: `${paths.shopFilter}/showByCategory/:categoryId`,
    component: ShopFilterComponent,
  },
  {
    path: paths.shopGrid,
    component: ShopDealsComponent
  },
  {
    path: paths.allProducts,
    component: AllProductComponent
  },
  {
    path: paths.term,
    component: TermServiceComponent
  },
  { path: '**', redirectTo: paths.home, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
