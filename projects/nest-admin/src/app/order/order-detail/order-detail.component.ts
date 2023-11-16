import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../../../nest-customer/src/app/service/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {

  orderDetail: any;
  billId: any;
  loading: boolean = false;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.billId = this.route.snapshot.paramMap.get('slug');
  }

  ngOnInit() {
    if (!this.billId) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.orderService.getBillDetail(this.billId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next : response => {
          this.orderDetail = response.response;
          console.log(this.orderDetail)
        },
        error: err => {
          alert(`Don't have this order`);
          this.router.navigate(['/home']);
        }
      })
  }
}
