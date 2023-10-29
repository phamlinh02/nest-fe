import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {paths} from "./const";

const routes: Routes = [
  { path: '**', redirectTo: paths.home, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
