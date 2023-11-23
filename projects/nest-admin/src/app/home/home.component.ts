import { AfterViewInit, Component } from '@angular/core';
import { ReportService } from "../service/report.service";
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { RateService } from '../service/rate.service';
import { Chart,registerables } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

Chart.register(ChartAnnotation,...registerables);

declare let template: any;

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  productQty: number = 0;
  order: number = 0;
  revenue: number = 0;
  orderQty: number = 0;

  constructor(
    private reportService: ReportService,
    private accountService: AccountService,
    private router: Router,
    private rateService: RateService,
  ) {

  }
  ngAfterViewInit(): void {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showReport();
      this.showRateStatistics();
      template.init();
    }
  }
  title = 'nest-customer';

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
          borderWidth: 2  ,
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

}
