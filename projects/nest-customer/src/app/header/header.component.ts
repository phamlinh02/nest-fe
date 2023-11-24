import { AfterViewInit, Component } from '@angular/core';
import { paths } from '../const';
import { ProductService } from "../service/product.service";
import { Router } from '@angular/router';
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';

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
  productImage: { [key: number]: SafeUrl } = {};
  categoryImage: { [key: number]: SafeUrl } = {};
  categoryFile: File | null = null;
  comparedProducts: any[] = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
  ) {
    this.cartService.cartUpdated.subscribe(() => {
      this.showCartItem();
    });
  }

  ngAfterViewInit() {

    this.showCategory();

    this.showCartItem();

    this.loadComparedProducts();

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
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;

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
  navigateTo(route: string) {
    const userData = localStorage.getItem('user');
    if (userData) {
      // Nếu người dùng đã đăng nhập, chuyển hướng đến đường dẫn được cung cấp
      this.router.navigate([route]);
    } else {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      this.router.navigate([`${paths.login}`]);
      this.clearCart();
    }
  }

  logout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  getComparisonCount(): number {
    return this.comparedProducts.length;
  }

}
