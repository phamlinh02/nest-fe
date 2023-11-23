import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AccountService } from '../../service/account.service';
import { ProductService } from "../../service/product.service";
import { paths } from "../../const";
import { UploadsService } from '../../service/uploads.service';
import { Chart,registerables } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';


Chart.register(ChartAnnotation,...registerables);

declare let template: any;

@Component({
  selector: 'app-rate',
  templateUrl: './statistic-product.component.html',
})
export class StatisticProductComponent implements AfterViewInit {
  title = 'nest-customer';
  rates: any[] = [];
  rateImages: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  paths = paths;
  products: any[] = [];
  productImage: { [key: number]: SafeUrl } = {};
  productFile: { [key: number]: SafeUrl } = {};
  statisticInfo: any = {};
  statisticChart!: Chart;
  

  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer,
    private accountService: AccountService,
    private productService: ProductService,
    private uploadsService: UploadsService,

  ) { }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showProducts();
      this.showStatisticProduct();
    }
  }

  showProducts() {
    this.productService.getAllProductsIsActive(this.currentPage, 8).subscribe((data: any) => {
      this.products = data.response.content;
      this.totalPages = Math.ceil(data.response.totalElements / 8);
      this.products.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showStatisticProduct(){
    this.productService.getStatisticProduct().subscribe((data: any) => {
        this.statisticInfo = data.response;
        this.statisticProductChart();
      },
        (error) => {
          console.error('Lỗi khi tải danh sách sản phẩm: ', error);
        });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.showProducts();
    }
  }
  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  statisticProductChart() {
    if (this.statisticInfo && this.statisticInfo.categoryStatistics) {
      const categories: string[] = this.statisticInfo.categoryStatistics.map((category: any) => category.categoryName);
      const totalProducts: number[] = this.statisticInfo.categoryStatistics.map((category: any) => category.totalProduct);
      const totalStockQuantities: number[] = this.statisticInfo.categoryStatistics.map((category: any) => category.totalStockQuantity);
  
      // Assuming you have Chart.js and the necessary plugins registered in your project
  
      // Create the chart
      this.statisticChart = new Chart('statisticChart', {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Total Products',
              data: totalProducts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Stock Quantity',
              data: totalStockQuantities,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

}
