import {AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import {paths} from "../const";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';

declare const template: any;

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
  productImage: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    this.showProductByCategory();
    this.searchProduct();
    template.init();
    
  }

  showProductByCategory(){
    this.route.params.subscribe((params) => {
      this.searchKeyword = params['productName'];
      const categoryId = +params['categoryId'];
      if (!isNaN(categoryId)) {
        this.categoryId = categoryId; // Gán giá trị 'id' lấy từ URL vào biến 'productId'
        this.productService.showProductsByCategoryPage(this.categoryId,this.currentPage, 8).subscribe(
          (data: any) => {
            this.showByCategory = data.response.content;
            this.totalPages = Math.ceil(data.response.totalElements / 8);
            this.showByCategory.forEach((product, index) => {
              this.getProductImage('product', product.image, index);
            });
            console.log(this.searchResult);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
          }
        );
      }
      
    });
  }

  searchProduct() {
    this.productService.searchProductsByName(this.searchKeyword,this.currentPage, 8).subscribe(
      (data: any) => {
        this.searchResult = data.response.content;
        this.totalPages = Math.ceil(data.response.totalElements / 8);
        this.searchResult.forEach((product, index) => {
          this.getProductImage('product', product.image, index);
        });
      },
      (error) => {
        console.error('Lỗi khi tìm kiếm sản phẩm: ', error);
      }
    );
  }

  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  changePage(page: number, isSearch: boolean) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (isSearch) {
        this.searchProduct();
      } else {
        this.showProductByCategory();
      }
    }
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

}
