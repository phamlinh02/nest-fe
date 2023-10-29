import {AfterViewInit, Component} from '@angular/core';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements AfterViewInit {
  title = 'nest-customer';

  ngAfterViewInit() {
    template.productInit();
  }
}
