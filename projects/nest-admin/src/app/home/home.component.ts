import { AfterViewInit, Component } from '@angular/core';
import { ReportService } from "../service/report.service";
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {

  }
  ngAfterViewInit(): void {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showReport();
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

}
