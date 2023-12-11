import {AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import {paths} from "../const";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { FavoriteService } from '../service/favorite.service';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';

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
  quantity: number = 1;
  accountId: number = 0;
  cartItems: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private favoriteService: FavoriteService,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      this.searchKeyword = params['productName'];
     
      this.searchProduct();
    });
    this.showProductByCategory();
    template.init();
    
  }

  showProductByCategory(){
    this.route.params.subscribe((params) => {
      this.searchKeyword = params['productName'];
      const categoryId = +params['categoryId'];
      if (!isNaN(categoryId)) {
        this.categoryId = categoryId; // Gán giá trị 'id' lấy từ URL vào biến 'productId'
        this.productService.showProductsByCategoryPage(this.categoryId).subscribe(
          (data: any) => {
            this.showByCategory = data.response.content;
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
    this.productService.searchProductsByName(this.searchKeyword).subscribe(
      (data: any) => {
        this.searchResult = data.response.content;
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

  addToWishlist(productId: number): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      const accountId = userData.id;

      this.favoriteService.addProductToFavorite({ accountId, productId }).subscribe(
        successResponse => {
          // Handle success
          alert('The product has been added to your favorites list');
          console.log('Thêm sản phẩm vào danh sách yêu thích thành công');

        },
        errorResponse => {
          alert('The product is already in the wish list!!!');
        }
      );
    } else {
      this.router.navigate([`${paths.login}`]);
      alert('Please login to add products to your favorites list!!!');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: Event): void {
    this.quantity = +(<HTMLInputElement>event.target).value;
  }

  addToCart(productId: number) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;

      this.cartService.addToCart(this.accountId, productId, this.quantity).subscribe(
        successResponse => {
          // Xử lý khi thành công
          alert('Sản phẩm đã được thêm vào giỏ hàng');
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
      alert('Vui lòng login để tiếp tục mua sắm !!!');
    }
  }

  calculateRatingWidth(averageRating: number): string {
    const width = averageRating * 20;
    return `${width}%`;
  }
  addToComparison(product: any): void {
    const localStorageValue = localStorage.getItem('comparedProducts');
    
    if (localStorageValue === null) {
      const comparedProducts = [product];
      localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts));
      alert('Product added to comparison list');
    } else {
      const comparedProducts = JSON.parse(localStorageValue);
      
      if (!comparedProducts.some((p: any) => p.id === product.id)) {
        comparedProducts.push(product);
        localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts));
        alert('Product added to comparison list');
      } else {
        alert('The product is already in the comparison list');
      }
    }
  }

}
