import {AfterViewInit, Component} from '@angular/core';
import { RateService } from '../service/rate.service';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { paths } from '../const';

declare let template: any;

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
})
export class RateComponent implements AfterViewInit {
  title = 'nest-customer';
  rates: any[] = [];
  rateImages: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  paths = paths;

  constructor(
    private rateService: RateService,
    private accountService: AccountService,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
  ){}

  ngAfterViewInit(){
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
    template.init();
    this.showAllRate();
    }
  }

  showAllRate(){
    this.rateService.getAllRates(this.currentPage, 8).subscribe((data: any) => {
    this.rates = data.response.content;
    this.totalPages = Math.ceil(data.response.totalElements / 8);
    this.rates.forEach((rate, index) => {
      this.getRateImage('rate', rate.image, index);
    });
    console.log(this.rates);
  },
    (error) => {
      console.error('Lỗi khi tải danh sách sản phẩm: ', error);
    });
  }
   //Hiển thị hình ảnh đánh giá
   getRateImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.rateImages[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
  calculateRatingWidth(star: number): string {
    const percentage = star * 20;
    return percentage + '%';
  }
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.showAllRate();
    }
  }
  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
}
