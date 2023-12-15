import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteService } from '../service/favorite.service';
import { paths } from "../const";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { CartService } from '../service/cart.service';


declare let template: any;

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
})
export class FavoriteComponent implements AfterViewInit {
  title = 'nest-customer';
  favoriteProducts: any[] = [];
  accountId: number = 0;
  paths = paths;
  productImage: { [key: number]: SafeUrl } = {};
  cartItems: any[] = [];
  quantity: number = 1;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private cartService: CartService,
  ) {

  }

  ngAfterViewInit(): void {
    
    this.loadFavoriteProducts();
    template.init();
    
  }

  loadFavoriteProducts() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;

      this.favoriteService.getFavoriteProducts(this.accountId).subscribe(
        (data: any) => {
          this.favoriteProducts = data.response.content;
          this.favoriteProducts.forEach((product, index) => {
            this.getProductImage('product', product.image, index);
          });
          console.log('favoriteProducts', this.favoriteProducts);
        },
        (error) => {
          console.error('Error loading favorite products:', error);
        }
      );
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

  removeProductFromFavorite(productId: number) {
    this.favoriteService.removeProductFromFavorite(this.accountId, productId).subscribe(
      () => {
        // Remove the product from the local array
        this.favoriteProducts = this.favoriteProducts.filter(product => product.id !== productId);
        this.loadFavoriteProducts();
        console.log(`Product with ID ${productId} removed from favorites`);
      },
      (error) => {
        console.error(`Error removing product with ID ${productId} from favorites:`, error);
      }
    );
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
      alert('Please login to continue shopping !!!');
    }
  }
}
