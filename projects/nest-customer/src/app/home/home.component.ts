import {AfterViewInit, Component} from '@angular/core';
import {paths} from "../const";
import {OrderService} from "../service/order.service";

declare const template : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit{
  title = 'nest-customer';
  public readonly paths = paths;

  constructor(
    private orderService : OrderService
  ) {
  }

  ngAfterViewInit() {
    template.init();

    this.orderService.getAllOrder({}).subscribe(response =>{
      console.log(response);
    });
    console.log('asfjhjsf')
  }
}
