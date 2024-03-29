import { Component,AfterViewInit} from '@angular/core';
import { paths } from '../const';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { CompareService } from '../service/compare.service';

declare const template: any;

@Component({
  selector: 'compare-item',
  templateUrl: './compare-item.component.html',
})
export class CompareItemComponent implements AfterViewInit{
  title = 'nest-customer';
  comparedProducts: any[] = [];
  paths = paths;
  productImage: { [key: number]: SafeUrl } = {};
  cartItem: any[] = [];
  accountId: number = 0;
  cartItems: any[] = [];
  quantity: number = 1;

  constructor(
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private cartService: CartService,
    private router: Router,
    private compareService: CompareService
    ) {}

    ngAfterViewInit() {
      this.loadComparedProducts();
      template.init();
    }

    loadComparedProducts() {
      const storedData = localStorage.getItem('comparedProducts');
      if (storedData !== null) {
        this.comparedProducts = JSON.parse(storedData);
  
        // Lấy hình ảnh cho từng sản phẩm so sánh
        this.comparedProducts.forEach((product, index) => {
          this.getProductImage('product', product.image, index);
        });
      }
    }

    getProductImage(type: string, filename: string, index: number) {
      this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
        const imageUrl = URL.createObjectURL(imageData);
        this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
      });
    }

    calculateRatingWidth(averageRating: number): string {
      const width = averageRating * 20;
      return `${width}%`;
    }

    removeFromComparison(productId: number) {
      const updatedComparedProducts = this.comparedProducts.filter((product) => product.id !== productId);
  
      // Lưu danh sách sản phẩm so sánh mới vào localStorage
      localStorage.setItem('comparedProducts', JSON.stringify(updatedComparedProducts));
  
      // Lấy chỉ số của sản phẩm cần xóa trong danh sách so sánh hiện tại
      const removedProductIndex = this.comparedProducts.findIndex((product) => product.id === productId);
  
      // Xóa thông tin của sản phẩm khỏi mảng hình ảnh
      if (removedProductIndex !== -1) {
        delete this.productImage[removedProductIndex];
      }
  
      // Cập nhật danh sách so sánh và thông báo về sự thay đổi
      this.comparedProducts = updatedComparedProducts;
      this.compareService.updateComparedProducts(updatedComparedProducts);
    }
  

    addToCart(productId: number) {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString).response;
        this.accountId = userData.id;
  
        this.cartService.addToCart(this.accountId, productId, this.quantity).subscribe(
          successResponse => {
            // Xử lý khi thành công
            alert('The product has been added to cart');
            console.log('Thêm sản phẩm thành công');
            this.cartItems = this.cartItems.filter(item => item.id !== productId);
            this.cartService.updateCart();
            this.quantity = 1;
          },
          errorResponse => {
            // Xử lý khi có lỗi
            console.error('Có lỗi khi thêm sản phẩm', errorResponse);
          }
        );
      } else {
        this.router.navigate([`${paths.login}`]);
        alert('Please login to continue shopping!!!');
      }
    }
    getComparisonCount(): number {
      return this.comparedProducts.length;
    }
}
