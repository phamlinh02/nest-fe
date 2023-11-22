import { AfterViewInit, Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { CategoryService } from '../../service/category.service';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { RateService } from '../../service/rate.service';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './rate-detail.component.html',
})
export class RateDetailComponent implements AfterViewInit {
  title = 'nest-customer';
  product: any = {};
  rate: any = {};
  rateId: number = 1;
  productImage!: SafeUrl;
  rateImage!: SafeUrl;
  accountImage!: SafeUrl;
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private router: Router,
    private rateService: RateService,
  ) { }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showRateById();
    }

  }

  showRateById(){
    this.route.params.subscribe((params) => {
        const id = +params['id'];
        if (!isNaN(id)) {
          this.rateId = id;
          this.rateService.getRateById(this.rateId).subscribe(
            (data: any) => {
              this.rate = data.response;
              this.getRateImage('rate', this.rate.image);
              this.getProductImage('product',this.rate.productImage);
              this.getAccountImage('account',this.rate.accountImage)
              console.log(this.rate);
            },
            (error) => {
              console.error('Lỗi khi tải chi tiết account: ', error);
            }
          );
        }
      });
  }

  getProductImage(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
  getRateImage(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.rateImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
  getAccountImage(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.accountImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
  
  calculateRatingWidth(star: number): string {
    const percentage = star * 20;
    return percentage + '%';
  }

  deleteRate(rateId: number): void {
    this.rateService.deleteRate(rateId).subscribe(
      (data: any) => {
        alert('Review has been successfully removed!');

        console.log('Đánh giá đã được xóa thành công!');

        this.router.navigate(['/rate']);
      },
      (error) => {
        console.error('Lỗi khi xóa đánh giá: ', error);
      }
    );
  }

}
