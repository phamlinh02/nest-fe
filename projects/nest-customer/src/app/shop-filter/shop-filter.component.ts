import {AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import {paths} from "../const";


@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html',
})
export class ShopFilterComponent implements AfterViewInit {
  title = 'nest-customer';
  searchResult: any[] = [];
  showByCategory: any[] = []; 
  searchKeyword: string = '';
  categoryId: number = 1;
  public readonly paths = paths;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      this.searchKeyword = params['productName'];
      const categoryId = +params['categoryId'];
      if (!isNaN(categoryId)) {
        this.categoryId = categoryId; // Gán giá trị 'id' lấy từ URL vào biến 'productId'
        this.productService.showProductsByCategory(this.categoryId).subscribe(
          (data: any) => {
            this.showByCategory = data.response.content;
            console.log(this.searchResult);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
          }
        );
      }
      this.searchProduct();
    });
  }

  searchProduct() {
    this.productService.searchProductsByName(this.searchKeyword).subscribe(
      (data: any) => {
        this.searchResult = data.response.content;
      },
      (error) => {
        console.error('Lỗi khi tìm kiếm sản phẩm: ', error);
      }
    );
  }
  

}
