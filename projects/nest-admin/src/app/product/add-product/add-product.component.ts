import {AfterViewInit, Component} from '@angular/core';
import { ProductService } from '../../service/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { CategoryService } from '../../service/category.service';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements AfterViewInit{
  title = 'nest-customer';
  product: any = {};
  productId: number = 1;
  productImage!: SafeUrl;
  productFile: File | null = null;
  errorMessage: string = '';
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private router: Router,
    private accountService: AccountService,
    private categoryService: CategoryService,
  ){}

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showCategories();
      template.init();
    }
    
  }

  saveProduct() {
    const formData = new FormData();
    formData.append('id', this.product.id);
    formData.append('productName', this.product.productName);
    formData.append('price', this.product.price);
    formData.append('quantity', this.product.quantity);
    formData.append('description', this.product.description);
    formData.append('isActive', this.product.isActive);
    formData.append('categoryName', this.product.categoryName);
    formData.append('endDate', this.product.endDate);

    if (this.productFile) {
      formData.append('productFile', this.productFile);
    }

    this.productService.createProduct(formData).subscribe(
      (response) => {
        console.log('Product saved successfully!', response);
        this.router.navigate(['/product']);
        window.location.reload;
      },
      (error) => {
        this.errorMessage = 'Product save failed, please check information...!';
      }
    );
  }

  onAvatarChange(event: any) {
    this.productFile = event.target.files[0];
    if (this.productFile) {
      const imageUrl = URL.createObjectURL(this.productFile);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  getProductImage(type: string,filename: string) {
    this.uploadsService.getImage(type,filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
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

}
