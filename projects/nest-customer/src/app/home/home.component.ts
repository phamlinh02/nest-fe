import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { paths } from "../const";
import { OrderService } from "../service/order.service";
import { ProductService } from "../service/product.service";
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { FavoriteService } from '../service/favorite.service';

declare const template: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  products: any[] = [];
  producttop: any[] = [];
  productRec: any[] = [];
  productSelling: any[] = [];
  productTrennding: any[] = [];
  categories: any[] = [];
  cartItem: any[] = [];
  accountId: number = 0;
  cartItems: any[] = [];
  categoryId: number = 1;
  showByCategory: any[] = [];
  quantity: number = 1;
  productImage: { [key: number]: SafeUrl } = {};
  categoryImage: { [key: number]: SafeUrl } = {};

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private favoriteService: FavoriteService,
    private cd: ChangeDetectorRef
  ) {
  }
  ngAfterViewInit() {
    template.init();

    //Lấy danh sách sản phẩm
    this.showProducts();

    //Lấy danh mục sản phẩm
    this.showCategories();

    this.showRecentlyAddedProducts();

    this.showTopSellingProducts();

    // this.showMostSearchedProducts();

    this.orderService.getAllOrder({}).subscribe(response => {
      console.log(response);
    });

    this.showProductsByCategory();
    this.showTopPopularProduct();
  }
  showProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data.response.content;

      this.products.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  showCategories() {
    this.categoryService.getAllCategoriesIsActive(0, 100).subscribe((data: any) => {
      this.categories = data.response.content;
      this.categories.forEach((category, index) => {
        this.getAllCategoryImage('category', category.imageCategory, index);
      });
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

  showProductsByCategory() {
    this.productService.showProductsByCategory(this.categoryId).subscribe(
      (data: any) => {
        this.showByCategory = data.response.content;
        this.showByCategory.forEach((product, index) => {
          this.getProductImage('product', product.image, index);
        });
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

  getAllCategoryImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.categoryImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  calculateRatingWidth(averageRating: number): string {
    const width = averageRating * 20;
    return `${width}%`;
  }

  showTopPopularProduct() {
    this.cartService.getTop10ProductPopular().subscribe((data: any) => {
      this.producttop = data.response;
      this.producttop.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.producttop);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showRecentlyAddedProducts() {
    this.productService.getRecentlyAddedProducts().subscribe((data: any) => {
      this.productRec = data.response;
      this.productRec.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.productRec);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showTopSellingProducts() {
    this.orderService.getTopSellingProducts().subscribe((data: any) => {
      this.productSelling = data.response;
      this.productSelling.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.productSelling);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  // showMostSearchedProducts() {
  //   this.productService.getMostSearchedProducts().subscribe((data: any) => {
  //     this.productTrennding = data.response;
  //     this.productTrennding.forEach((product, index) => {
  //       this.getProductImage('product', product.image, index);
  //     });
  //     console.log(this.productTrennding);
  //   },
  //     (error) => {
  //       console.error('Lỗi khi tải danh sách sản phẩm: ', error);
  //     });
  // }

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
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      const accountId = userData.id;

      this.favoriteService.addProductToFavorite({ accountId, productId }).subscribe(
        successResponse => {
          // Handle success
          alert('The product has been added to your favorites list');
          console.log('Thêm sản phẩm vào danh sách yêu thích thành công');
          this.cd.detectChanges();

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


