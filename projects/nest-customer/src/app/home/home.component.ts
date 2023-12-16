import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { paths } from "../const";
import { OrderService } from "../service/order.service";
import { ProductService } from "../service/product.service";
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { FavoriteService } from '../service/favorite.service';
import { CompareService } from '../service/compare.service';
import { TokenStorageService } from '../service/token-storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare const template: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  products: any[] = [];
  categories: any[] = [];
  cartItem: any[] = [];
  producttop: any[] = [];
  productRec: any[] = [];
  productRecen: any[] = [];
  productTrending: any[] = [];
  productSelling: any[] = [];
  productRate: any[] = [];
  accountId: number = 0;
  cartItems: any[] = [];
  categoryId: number = 1;
  showByCategory: any[] = [];
  quantity: number = 1;
  topRateProducts: any[] = [];
  comparedProducts: any[] = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private uploadsService: UploadsService,
    private favoriteService: FavoriteService,
    private compareService: CompareService,
    private token: TokenStorageService,
    private sanitizer: DomSanitizer
  ) {
  }
  ngAfterViewInit() {


    //Lấy danh sách sản phẩm
    this.showProducts();

    //Lấy danh mục sản phẩm
    this.showCategories();

    this.orderService.getAllOrder({}).subscribe(response => {
      console.log(response);
    });

    this.showProductsByCategory();
    this.showMostSearchedProducts();
    this.showRecentlyAddedProducts();
    this.showTopRatedProducts();
    this.showTopSellingProducts();
    this.showTopRateProducts();
    this.showTopPopularProduct();
    this.showRecentlyAdded();
    template.init();
  }
  showProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data.response.content;

      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }


  showCategories() {
    this.categoryService.getAllCategoriesIsActive(0, 100).subscribe((data: any) => {
      this.categories = data.response.content;
      console.log(this.categories);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
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
    const userString = this.token.getUser();
    if (userString) {
      const userData = this.token.getUser();
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

  showProductsByCategory() {
    this.productService.showProductsByCategory(this.categoryId).subscribe(
      (data: any) => {
        this.showByCategory = data.response.content;
      },
      (error) => {
        console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
      }
    );
  }
  changeCategory(newCategoryId: number) {
    this.categoryId = newCategoryId;
    console.log(this.categoryId);
    this.showProductsByCategory(); // Gọi lại phương thức để cập nhật sản phẩm
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
        this.compareService.updateComparedProducts(comparedProducts);
        alert('Product added to comparison list');
      } else {
        alert('The product is already in the comparison list');
      }
    }
  }

  addToWishlist(productId: number): void {
    const userString = this.token.getUser();
    if (userString) {
     
      const accountId = userString.id;

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

  showTopPopularProduct() {
    this.productService.getTop10ProductPopular().subscribe((data: any) => {
      this.producttop = data.response;
      console.log(this.producttop);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showRecentlyAdded() {
    this.productService.getRecentlyAdded().subscribe((data: any) => {
      this.productRecen = data.response;
      console.log(this.productRec);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showRecentlyAddedProducts() {
    this.productService.getRecentlyAddedProducts().subscribe((data: any) => {
      this.productRec = data.response;
      console.log(this.productRec);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showTopSellingProducts() {
    this.productService.getTopSellingProducts().subscribe((data: any) => {
      this.productSelling = data.response;
      console.log(this.productSelling);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showMostSearchedProducts() {
    this.productService.getMostSearchedProducts().subscribe((data: any) => {
      this.productTrending = data.response;
      console.log(this.productTrending);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showTopRatedProducts() {
    this.productService.getTopRatedProducts(3).subscribe((data: any) => {
      this.productRate = data.response;
      console.log(this.productRate);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showTopRateProducts() {
    this.productService.getTopRatedProducts(10).subscribe((data: any) => {
      this.topRateProducts = data.response;

      console.log('ProductTopRate: ', this.topRateProducts);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  getImageProductUrl(filename: string): string {
    const type = 'product'; 
    return this.uploadsService.getImageUrl(type, filename);
  }
  getImageCategoryUrl(filename: string): string {
    const type = 'category'; 
    return this.uploadsService.getImageUrl(type, filename);
  }

}


