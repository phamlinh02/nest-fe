import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {paths} from "./const";
import {HomeComponent} from "./home/home.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ProductComponent, ProductDetailComponent, AddProductComponent} from "./product";
import {OrderComponent, OrderDetailComponent} from "./order";
import {RateComponent, RateDetailComponent} from "./rate";
import {AccountComponent, AccountDetailComponent, LoginComponent, AddAccountComponent,RolesComponent, ForgetComponent, AccountInfoComponent, ChangePasswordComponent} from "./account";
import { StatisticProductComponent } from './statistical';

const routes: Routes = [
  {
    path: paths.home, component: HomeComponent
  },
  {
    path: paths.categories,
    component: CategoriesComponent
  },
  {
    path: `${paths.categories}/:id`,
    component: CategoriesComponent
  },
  {
    path: paths.product, component: ProductComponent
  },
  {
    path: `${paths.product}/:id`,
     component: ProductDetailComponent
  },
  {
    path: paths.addProduct
    , component: AddProductComponent
  },
  {
    path: paths.order, component: OrderComponent
  },
  {
    path: paths.order + '/:slug', component: OrderDetailComponent
  },
  {
    path: paths.rate, component: RateComponent
  },
  {
    path: `${paths.rate}/:id`, component: RateDetailComponent
  },
  {
    path: paths.account, component: AccountComponent
  },
  {
    path: `${paths.account}/role`,
    component: RolesComponent
  },
  {
    path: `${paths.account}/role/:id`,
    component: RolesComponent
  },
  {
    path: `${paths.account}/add`,
    component: AddAccountComponent
  },
  {
    path: `${paths.account}/:id`,
    component: AccountDetailComponent
  },
  {
    path: `${paths.forgetPass}`,
    component: ForgetComponent
  },
  {
    path: `${paths.accountInfo}`,
    component: AccountInfoComponent
  },
  {
    path: paths.login,
    component: LoginComponent
  },
  {
    path: paths.changePass,
    component: ChangePasswordComponent
  },
  {
    path: paths.statisticProduct,
    component: StatisticProductComponent
  },
  {
    path: '**', redirectTo: paths.home, pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {
    scrollPositionRestoration: "top",
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
