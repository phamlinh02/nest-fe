import {AfterViewInit, Component} from '@angular/core';
import {CartService} from "../service/cart.service";
import {finalize} from "rxjs";
import {MessageService} from "primeng/api";
import {OrderService} from "../service/order.service";
import {paths} from "../const";
import {Router} from "@angular/router";

declare const template: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements AfterViewInit {
  readonly paths = paths
  title = 'nest-customer';
  account: any = {};
  orderDetails: any = [];
  bill: any = {};
  loading: boolean = false;
  totalPrice: number = 0;
  createSuccess: boolean = true;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  loadData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.loading = true;
      this.account = JSON.parse(userString).response;
      this.cartService.getAllCarts(this.account.id)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((response) => {
          this.orderDetails = response.response;
          this.orderDetails.forEach((order: any) => {
            this.totalPrice += order.quantity * order.productId.price;
          })
        })
    }

  }

  ngAfterViewInit() {
    template.init();
    this.loadData();
  }

  checkInValidForm() {
    return !(this.account.address && this.account.phone && this.account.email && this.account.username && this.account.fullName)
  }

  checkoutCart() {

    if (this.checkInValidForm()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please fill all info'});
    }

    const billDetail = this.orderDetails.map((order: any) => {
      return {productId: order.productId.id, quantity: order.quantity}
    })
    const param = {
      account: this.account,
      bill: this.bill,
      billDetails: billDetail
    }
    this.orderService.createBill(param).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Create bill success'});
        this.createSuccess = true;
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something wrong, Please try again'});
      }
    })
  }

  viewListBill() {
    if (!this.createSuccess) return;

    this.router.navigate(['/' + paths.accountInfo], {queryParams: {tab: 'order'}})
  }
}
