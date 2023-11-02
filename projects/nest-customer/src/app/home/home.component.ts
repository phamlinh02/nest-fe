import {AfterViewInit, Component} from '@angular/core';
import {paths} from "../const";
import {OrderService} from "../service/order.service";
import {ProductService} from "../service/product.service";
import {CategoryService} from "../service/category.service";
import {IResponse} from "../service/response.model";
import { ActivatedRoute } from '@angular/router';


declare const template : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit{
  title = 'nest-customer';
  public readonly paths = paths;
  products: any[] = [];
  categories: any[] = [];

  constructor(
    private orderService : OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute 
  ) {
  }
  ngAfterViewInit() {
    template.init();

    //Lấy danh sách sản phẩm
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data.response.content;
      console.log(this.products);
    },
    (error) => {
      console.error('Lỗi khi tải danh sách sản phẩm: ', error);
    });

    //Lấy danh mục sản phẩm
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.categories = data.response.content;
      console.log(this.categories);
    },
    (error) => {
      console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
    });

    this.orderService.getAllOrder({}).subscribe(response =>{
      console.log(response);
    });

  }

}
