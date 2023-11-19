import { AfterViewInit, Component } from '@angular/core';
import { ProductService } from "../service/product.service";
import { paths } from "../const";
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare const template: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  products: any[] = [];
  productImage: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  productFile: { [key: number]: SafeUrl } = {};

  constructor(
    private productService: ProductService,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
  ) {
  }
  ngAfterViewInit() {

    this.showProducts();
    template.init();
  }

  showProducts() {
    this.productService.getAllProducts(this.currentPage, 8).subscribe((data: any) => {
      this.products = data.response.content;
      this.totalPages = Math.ceil(data.response.totalElements / 8);
      this.products.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.showProducts();
    }
  }
  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(
      (response) => {
        this.showProducts();
        console.log('Sản phẩm đã được xóa thành công');
      },
      (error) => {
        console.error('Lỗi khi xóa sản phẩm', error);
      }
    );
  }
}
