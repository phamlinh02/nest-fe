import { AfterViewInit, Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { CategoryService } from '../../service/category.service';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements AfterViewInit {
  title = 'nest-customer';
  product: any = {};
  productId: number = 1;
  productImage!: SafeUrl;
  productFile: File | null = null;
  errorMessage: string = '';
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showProductById();
      this.showCategories();
    }

  }

  showProductById() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.productId = id;
        this.productService.getProductById(this.productId).subscribe(
          (data: any) => {
            this.product = data.response;
            this.getProductImage('product', this.product.image);
            console.log(this.product);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết account: ', error);
          }
        );
      }
    });
  }

  updateProduct() {
    const formData = new FormData();

    if (this.productFile) {
      formData.append('productFile', this.productFile);
    }

    formData.append('id', this.product.id);
    formData.append('productName', this.product.productName);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('quantity', this.product.quantity);
    formData.append('isActive', this.product.isActive);
    formData.append('categoryName', this.product.categoryName);

    this.productService.updateProduct(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Product update failed, please check information...!';
      }
    );
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

  onAvatarChange(event: any) {
    this.productFile = event.target.files[0];
    if (this.productFile) {
      const imageUrl = URL.createObjectURL(this.productFile);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  getProductImage(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

}
