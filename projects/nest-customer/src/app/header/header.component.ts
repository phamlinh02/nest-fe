import {AfterViewInit, Component } from '@angular/core';
import { paths} from '../const';
import {ProductService} from "../service/product.service";
import { Router } from '@angular/router';
import {CategoryService} from "../service/category.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;
  productName: string= "";
  categories: any[] = [];
  products: any[] = [];

  constructor(
    private router: Router ,
    private categoryService: CategoryService, 
    private productService: ProductService,
  ) {}

  ngAfterViewInit() {

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

  }

  searchProductByName() {
    if (this.productName) {
      // Xử lý sự kiện nhập từ khóa và chuyển hướng đến trang shop-filter với từ khóa tìm kiếm
      this.router.navigate([`${paths.shopFilter}/${this.productName}`]);
    }
  }

  //Kiểm tra trạng thái đăng nhập
  navigateTo(route: string) {
    const userData = localStorage.getItem('user');
    if (userData) {
      // Nếu người dùng đã đăng nhập, chuyển hướng đến đường dẫn được cung cấp
      this.router.navigate([route]);
    } else {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      this.router.navigate([`${paths.login}`]);
    }
  }

  logout(){
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

}
