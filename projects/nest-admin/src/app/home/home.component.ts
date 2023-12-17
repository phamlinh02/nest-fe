import {AfterViewInit, Component} from '@angular/core';
import {ReportService} from "../service/report.service";
import {AccountService} from '../service/account.service';
import {Router} from '@angular/router';
import {RateService} from '../service/rate.service';
import {Chart, registerables} from 'chart.js';
import {OrderService} from "../service/order.service";
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { paths } from '../const';
import { ProductService } from '../service/product.service';
import { TokenStorageService } from '../service/token-storage.service';
// import * as ChartAnnotation from 'chartjs-plugin-annotation';

// Chart.register(ChartAnnotation,...registerables);

declare let template: any;

interface Account {
  id: number;
  // Add other properties as needed
}

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  productQty: number = 0;
  order: number = 0;
  revenue: number = 0;
  orderQty: number = 0;
  data: any = {};
  accounts: any[] = [];
  title = 'nest-customer';
  statisticsBill: any;
  latestBill: any;
  latestUser: any;
  statisticInfo: any = {};
  statisticChart!: Chart;
  userAvatars: { [key: number]: SafeUrl } = {};
  paths = paths;
  filter = {
    status: '',
    fromDate: new Date(),
    toDate: new Date()
  }
  month = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }

  constructor(
    private reportService: ReportService,
    private accountService: AccountService,
    private router: Router,
    private rateService: RateService,
    private orderService: OrderService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private productService: ProductService,
    private token: TokenStorageService

  ) {

  }

  ngAfterViewInit(): void {
    console.log('home page')
    if (!this.token.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showReport();
      this.showRateStatistics();
      this.getStatisticsBill();
      this.getALlBill();
      this.getAllUsers();
      this.showStatisticProduct();
      template.init();
    }
  }

  showReport() {
    this.reportService.getAllQtyProduct().subscribe(data => {
      this.productQty = data;
    });

    this.reportService.getQtyOrder().subscribe(data => {
      this.order = data;
    });

    this.reportService.getRevenue().subscribe(data => {
      this.revenue = data;
    });

    this.reportService.getQtyOrderInMonth().subscribe(data => {
      this.orderQty = data;
    });
  }

  showRateStatistics() {
    this.rateService.getReportRate().subscribe((data: any) => {
      const chartData = {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        datasets: [{
          label: 'Number of Ratings',
          data: [
            data.response.fiveStarCount,
            data.response.fourStarCount,
            data.response.threeStarCount,
            data.response.twoStarCount,
            data.response.oneStarCount,
          ],
          backgroundColor: [
            '#5897fb',
            '#7bcf86',
            '#ff9076',
            '#d595e5',
            '#CC0033',
          ],
          borderColor: [
            '#5897fb',
            '#7bcf86',
            '#ff9076',
            '#d595e5',
            '#CC0033',
          ],
          borderWidth: 2,
        }],
      };

      const ctx = document.getElementById('rateChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    });
  }

  getStatisticsBill() {
    this.orderService.getStatisticsBill().subscribe((res) => {
      this.statisticsBill = res.response;
      this.data = {
        labels: Object.values(this.month),
        datasets: [
          {
            label: 'Total Bill',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            fill: true,
            borderColor: 'blue',
            tension: 0.1,
            backgroundColor: 'rgba(184,195,232,0.13)'
          },
          {
            label: 'New Bill',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            fill: true,
            borderColor: 'pink',
            tension: 0.1,
            backgroundColor: 'rgba(246,172,234,0.16)'
          },
          {
            label: 'Cancel Bill',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            fill: true,
            borderColor: 'red',
            tension: 0.1,
            backgroundColor: 'rgba(245,167,167,0.16)'
          },
          {
            label: 'Complete BIll',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            fill: true,
            borderColor: 'green',
            tension: 0.1,
            backgroundColor: 'rgba(172,245,167,0.16)'
          }
        ]
      }

      this.statisticsBill.totalBill.forEach((total : any) => {
        const month = new Date(total.orderDate).getMonth();
         ++this.data.datasets[0].data[month]
      })
      this.statisticsBill.newBill.forEach((total : any) => {
        const month = new Date(total.orderDate).getMonth();
        ++this.data.datasets[1].data[month]
      })
      this.statisticsBill.cancelBill.forEach((total : any) => {
        const month = new Date(total.orderDate).getMonth();
        ++this.data.datasets[2].data[month]
      })
      this.statisticsBill.completeBill.forEach((total : any) => {
        const month = new Date(total.orderDate).getMonth();
        ++this.data.datasets[3].data[month]
      })

    });
  }

  getALlBill() {
    let param: any = {
      status: this.filter.status.toUpperCase(),
      fromDate: this.filter.fromDate,
      toDate: this.filter.toDate
    }
    const header = {
      size: 10,
      page: 0
    }
    if (!param.status || param.status.toLowerCase() === 'show all') delete param.status
    this.orderService.getAllOrder(param, header).subscribe((res) => {
      this.latestBill = res.response.content;
    })
  }
  getAllUsers() {
    this.accountService.get4Users().subscribe((data: any) => {
      this.accounts = data.response.content;
      const unsortedUsers = data.response.content;

      // Sắp xếp danh sách theo id giảm dần
      const sortedUsers = unsortedUsers.sort((a: Account, b: Account) => b.id - a.id);

      // Chọn 3 người dùng đầu tiên sau khi sắp xếp
      this.accounts = sortedUsers.slice(0, 7);
      this.accounts.forEach((account, index) => {
        this.getUserAvatar('account', account.avatar, index);
      });
      console.log(this.accounts);
    }, (error) => {
      console.error('Lỗi khi tải danh sách Users ', error);
    });
  }
  getUserAvatar(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatars[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
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

  statisticProductChart() {
    if (this.statisticInfo && this.statisticInfo.categoryStatistics) {
      const categories: string[] = this.statisticInfo.categoryStatistics.map((category: any) => category.categoryName);
      const totalProducts: number[] = this.statisticInfo.categoryStatistics.map((category: any) => category.totalProduct);
      const totalStockQuantities: number[] = this.statisticInfo.categoryStatistics.map((category: any) => category.totalStockQuantity);

      // Giả sử bạn đã đăng ký Chart.js và các plugin cần thiết trong dự án của bạn

      // Tạo biểu đồ
      this.statisticChart = new Chart('statisticChart', {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Total Stock Quantity',
              data: totalStockQuantities,
              borderColor: '#F18D9E',
              borderWidth: 2,
              fill: false,
              type: 'line',
              yAxisID: 'stock',
            },
            {
              label: 'Prouducts',
              data: totalProducts,
              backgroundColor: '#98DBC6',
              borderColor: '#98DBC6',
              borderWidth: 1,
              yAxisID: 'products',
            },

          ],
        },
        options: {
          scales: {
            products: {
              type: 'linear',
              position: 'left',
            },
            stock: {
              type: 'linear',
              position: 'right',
            },
          },
        },
      });
    }
  }


}
