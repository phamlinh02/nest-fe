import {AfterViewInit, Component} from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { paths } from '../const';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements AfterViewInit {
  title = 'nest-customer';
  product: any = {};
  productId: number = 1;
  paths = paths;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    template.productInit();
    this.route.params.subscribe(params => {
      const id = +params['id']; // Lấy giá trị tham số 'id' từ URL
      if (!isNaN(id)) {
        this.productId = id; // Gán giá trị 'id' lấy từ URL vào biến 'productId'
        this.productService.getProductById(this.productId).subscribe(
          (data: any) => {
            this.product = data.response;
            console.log(this.product);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
          }
        );
      }
    });

  }
}
