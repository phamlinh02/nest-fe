import { AfterViewInit, Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { paths } from '../const';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { RateService } from '../service/rate.service';
import { FavoriteService } from '../service/favorite.service';
import { TokenStorageService } from '../service/token-storage.service';

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
  accountId: number = 0;
  cartItems: any[] = [];
  quantity: number = 1;
  productImage!: SafeUrl;
  productFile: File | null = null;
  productRates: any[] = [];
  rate: any = { star: 0 };
  errorMessage: string = '';
  user: any;
  userAvatars: { [key: number]: SafeUrl } = {};
  rateImages: { [key: number]: SafeUrl } = {};
  rateFile: File | null = null;
  rateImageDetail!: SafeUrl;
  userRole: string = '';
  totalRate: number = 0;
  recommendedProducts: any[] = [];
  relateProductImage: { [key: number]: SafeUrl } = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private rateService: RateService,
    private favoriteService: FavoriteService,
    private token: TokenStorageService
  ) {
    const userData = this.token.getUser();
    if (userData) {
      this.user = this.token.getUser();
      console.log(this.user);
    }
  }
  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.productId = id;
        this.productService.getProductById(this.productId).subscribe(
          (data: any) => {
            this.product = data.response;
            this.getProductImage('product', this.product.image);
            console.log('Sản phẩm:', this.product);
            this.showRatesByProductId(this.productId);
            this.showRelatedProductsByPriceRange(this.productId, this.product.price);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
          }
        );
      }
    });
    if (this.user) {
      this.rate.accountId = this.user.id;
    }
    template.init();

  }

  getProductImage(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  getRelatedProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.relateProductImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
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
      this.cartService
        .addToCart(this.accountId, productId, this.quantity)
        .subscribe(
          (successResponse) => {
            alert('The product has been added to your favorites list');
            console.log('Thêm sản phẩm thành công');
            this.cartItems = this.cartItems.filter((item) => item.id !== productId);
            this.cartService.updateCart();
          },
          (errorResponse) => {
            console.error('Có lỗi khi thêm sản phẩm', errorResponse);
          }
        );
    } else {
      this.router.navigate([`${paths.login}`]);
      alert('Vui lòng đăng nhập để tiếp tục mua sắm !!!');
    }
  }
  //Hiển thị đánh giá theo id sản phẩm
  showRatesByProductId(productId: number): void {
    this.rateService.showRatesByProductId(productId).subscribe(
      (data: any) => {
        this.productRates = data.response.content;
        this.productRates.forEach((rate, index) => {
          this.getUserAvatar('account', rate.accountImage, index);
        });
        this.productRates.forEach((rate, index) => {
          this.getRateImage('rate', rate.image, index);
        });
        this.totalRate = this.productRates.length;
        console.log('Đánh giá sản phẩm:', this.productRates);
      },
      (error) => {
        console.error('Lỗi khi tải đánh giá sản phẩm: ', error);
      }
    );
  }
  //Xét số sao
  calculateRatingWidth(star: number): string {
    const percentage = star * 20;
    return percentage + '%';
  }
  //Tạo đánh giá
  saveRate() {
    const userString = this.token.getUser();
    if (userString) {
      const formData = new FormData();
      formData.append('productId', this.productId.toString());
      formData.append('accountId', this.user.id.toString());
      formData.append('star', this.rate.star.toString());
      formData.append('comment', this.rate.comment);

      if (this.rateFile) {
        formData.append('rateFile', this.rateFile);
      }

      this.rateService.saveRate(formData).subscribe(
        (data: any) => {
          alert('Evaluation of success!');
          this.showRatesByProductId(this.productId);
        },
        (error) => {
          console.error('Lỗi khi gửi đánh giá: ', error);
        }
      );
    }
    else {
      alert('Please log in to rate a product!');
      this.router.navigate([`${paths.login}`]);

    }
  }

  //Click chọn sao
  onStarClick(event: any) {
    const starValue = parseInt(event.target.dataset.value, 10);
    this.rate.star = starValue;
  }
  starClass(starValue: number): string {
    return starValue <= this.rate.star ? 'active' : '';
  }

  //Hiển thị hình ảnh người đánh giá
  getUserAvatar(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatars[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  //Hiển thị hình ảnh đánh giá
  getRateImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.rateImages[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  //Chọn ảnh đánh giá từ máy
  onRateChange(event: any) {
    this.rateFile = event.target.files[0];
    if (this.rateFile) {
      const imageUrl = URL.createObjectURL(this.rateFile);
      this.rateImageDetail = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }
  //Xóa đánh giá
  deleteRate(rateId: number): void {
    this.rateService.deleteRate(rateId).subscribe(
      (data: any) => {
        alert('Review has been successfully removed!');

        console.log('Đánh giá đã được xóa thành công!');

        this.showRatesByProductId(this.productId);
      },
      (error) => {
        console.error('Lỗi khi xóa đánh giá: ', error);
      }
    );
  }
  //Xét điều kiện xóa Rate
  canDeleteComment(rate: any): boolean {
    if (!this.user) {
      return false;
    }
    if (this.user.roleName === 'ROLE_ADMIN' || this.user.roleName === 'ROLE_DIRECTOR') {
      return true;
    }
    if (rate && rate.accountId === this.user.id) {
      return true;
    }
    return false;
  }

  //Tính toán đánh giá phản hồi của người dùng dựa trên số sao
  calculatePercentage(star: number): string {
    if (this.totalRate === 0) {
      return '0.00';
    }
    const percentage = (this.productRates.filter(rate => rate.star === star).length / this.totalRate) * 100;
    return percentage.toFixed(2);
  }

  showRelatedProductsByPriceRange(productId: number, price: number): void {
    const priceRange = 2; // Define your price range
    const lowerBound = price - priceRange;
    const upperBound = price + priceRange;

    this.productService.getAllProducts().subscribe(
      (data: any) => {
        const products = data.response.content; // Access the 'content' property
        this.recommendedProducts = products
          .filter((product: any) => product.id !== productId && product.price >= lowerBound && product.price <= upperBound)
          .slice(0, 4);
        this.recommendedProducts.forEach((product, index) => {
          this.getRelatedProductImage('product', product.image, index);
        });

        console.log('Related Products:', this.recommendedProducts);
      },
      (error) => {
        console.error('Error fetching all products: ', error);
      }
    );
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

  addToWishlist(productId: number): void {
    const userString = this.token.getUser();
    if (userString) {
      const userData = this.token.getUser();
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

}