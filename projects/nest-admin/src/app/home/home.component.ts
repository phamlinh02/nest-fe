import {AfterViewInit, Component} from '@angular/core';
import {ReportService} from "../service/report.service";
import {AccountService} from '../service/account.service';
import {Router} from '@angular/router';
import {RateService} from '../service/rate.service';
import {Chart, registerables} from 'chart.js';
import {OrderService} from "../service/order.service";
// import * as ChartAnnotation from 'chartjs-plugin-annotation';

// Chart.register(ChartAnnotation,...registerables);

declare let template: any;

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  productQty: number = 0;
  order: number = 0;
  revenue: number = 0;
  orderQty: number = 0;
  data: any = {};
  title = 'nest-customer';
  statisticsBill: any;
  latestBill: any;
  filter = {
    status: '',
    date: new Date()
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
    private orderService: OrderService
  ) {

  }

  ngAfterViewInit(): void {
    console.log('home page')
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showReport();
      this.showRateStatistics();
      this.getStatisticsBill();
      this.getALlBill();
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
      status: this.filter.status,
      orderDate: this.filter.date
    }
    const header = {
      size: 10,
      number: 0
    }
    if (!param.status) delete param.status
    this.orderService.getAllOrder(param, header).subscribe((res) => {
      this.latestBill = res.response.content;
    })
  }
}
