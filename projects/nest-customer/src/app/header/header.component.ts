import { AfterViewInit, Component } from '@angular/core';
import { paths } from '../const';
import { ProductService } from "../service/product.service";
import { Router } from '@angular/router';
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { FavoriteService } from '../service/favorite.service';
import { ActivatedRoute} from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { TokenStorageService } from '../service/token-storage.service';

declare let template: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  productName: string = "";
  categories: any[] = [];
  products: any[] = [];
  cartItems: any[] = [];
  accountId: number = 0;
  totalValue: number = 0;
  totalProduct: number = 0;
  totalProductFavorite: number = 0;
  totalComparedProducts: number = 0;
  productImage: { [key: number]: SafeUrl } = {};
  categoryImage: { [key: number]: SafeUrl } = {};
  categoryFile: File | null = null;
  comparedProducts: any[] = [];
  favoriteProducts: any[] = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private compareService: CompareService,
    private token: TokenStorageService
  ) {
    this.cartService.cartUpdated.subscribe(() => {
      this.showCartItem();
    });
    this.favoriteService.favoriteUpdated.subscribe(() => {
      this.loadFavoriteProducts();
    })
    this.compareService.comparedProducts$.subscribe(products => {
      this.totalComparedProducts = products.length;
    });
    this.compareService.comparedProductsChanged$.subscribe(() => {
      this.updateTotalComparedProducts();
    });
  }

  ngAfterViewInit() {

    this.showCategory();

    this.showCartItem();

    this.loadComparedProducts();

    this.loadFavoriteProducts();

    this.updateTotalComparedProducts();

  }

  updateTotalComparedProducts() {
    this.compareService.comparedProducts$.subscribe(products => {
      this.totalComparedProducts = products.length;
    });
  }

  searchProductByName() {
    if (this.productName) {
      // Xử lý sự kiện nhập từ khóa và chuyển hướng đến trang shop-filter với từ khóa tìm kiếm
      this.router.navigate([`${paths.shopFilter}/search/${this.productName}`]);
    }
  }

  //Hiển thị thông tin category
  showCategory() {
    this.categoryService.getAllCategoriesIsActive(0, 100).subscribe((data: any) => {
      this.categories = data.response.content;
      this.categories.forEach((category, index) => {
        this.getAllCategoryImage('category', category.imageCategory,index);
      });
      console.log(this.categories);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
      });
  }

  //Hiển thị thông tin giỏ hàng
  showCartItem() {
    const userString = this.token.getUser();
    if (userString) {
      this.accountId = userString.id;

      // Gọi phương thức để lấy danh sách sản phẩm trong giỏ hàng dựa trên accountId
      this.cartService.getAllCarts(this.accountId).subscribe((data: any) => {
        this.cartItems = data.response; // Giả sử dữ liệu trả về có cấu trúc phù hợp
        this.cartItems.forEach((cartItem, index) => {
          this.getProductImage('product', cartItem.productId.image, index);
        });
        this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        this.totalProduct = this.cartItems.length;
        console.log(this.cartItems, this.totalValue);
      },
        (error) => {
          console.error('Lỗi khi tải danh sách sản phẩm trong giỏ hàng: ', error);
        });
    }
  }

  //Xóa sản phẩm bằng id ra khỏi giỏ hàng
  removeCartItem(id: number) {
    this.cartService.removeById(id).subscribe(
      response => {
        // Xử lý khi thành công
        console.log(`Sản phẩm với id ${id} đã được xóa khỏi giỏ hàng`);

        // Cập nhật lại danh sách giỏ hàng
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        this.totalProduct = this.cartItems.reduce((total, item) => total + item.quantity, 0)
        window.location.reload;

      },
      error => {
        // Xử lý khi có lỗi
        console.error('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng', error);
      }
    );
  }
  //Clear Cart
  clearCart() {
    this.cartItems = [];
    this.totalValue = 0;
    this.totalProduct = 0;
  }


  //Kiểm tra trạng thái đăng nhập

  logout() {
    this.token.signOut();

    localStorage.removeItem('comparedProducts');
    this.comparedProducts.length = 0;
    this.totalProductFavorite = 0;
    // Xóa thông tin giỏ hàng
    this.clearCart();
  }

  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  getAllCategoryImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.categoryImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  loadComparedProducts(): void {
    const storedData = localStorage.getItem('comparedProducts');
    if (storedData !== null) {
      this.comparedProducts = JSON.parse(storedData);
    }
  }

  loadFavoriteProducts() {
    const userString = this.token.getUser();
    if (userString) {
    this.accountId = userString.id;

    this.favoriteService.getFavoriteProducts(this.accountId).subscribe(
      (data: any) => {
        this.favoriteProducts = data.response.content;
        this.favoriteProducts.forEach((product, index) => {
          this.getProductImage('product', product.image, index);
        });
        this.totalProductFavorite = this.favoriteProducts.length;
        console.log('favoriteProducts', this.favoriteProducts, this.totalProductFavorite);
      },
      (error) => {
        console.error('Error loading favorite products:', error);
      }
    );
  }

}

onCategoryChange(event: any) {
  console.log('Category changed:', event.target.value);
  const categoryId = event.target.value;
  this.router.navigate([`${paths.shopFilter}/showByCategory/${categoryId}`], { relativeTo: this.route });
}
isLoggedIn(): boolean {
  return this.token.isLoggedIn(); // Return `true` if 'user' exists in localStorage
}

}
