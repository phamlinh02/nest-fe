import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {paths} from "./const";
import {HomeComponent} from "./home/home.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ProductComponent, ProductDetailComponent} from "./product";
import {OrderComponent, OrderDetailComponent} from "./order";
import {RateComponent} from "./rate/rate.component";
import {AccountComponent, AccountDetailComponent, LoginComponent, AddAccountComponent} from "./account";

const routes: Routes = [
  {
    path: paths.home, component: HomeComponent
  },
  {
    path: paths.categories, component: CategoriesComponent
  },
  {
    path: paths.product, component: ProductComponent
  },
  {
    path: `${paths.product}/:id`,
     component: ProductDetailComponent
  },
  {
    path: paths.addProduct, component: ProductDetailComponent
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
    path: paths.account, component: AccountComponent
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
    path: paths.login, component: LoginComponent
  },
  {
    path: '**', redirectTo: paths.home, pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
