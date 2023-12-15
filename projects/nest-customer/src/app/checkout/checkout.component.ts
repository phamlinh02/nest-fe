import {AfterViewInit, Component} from '@angular/core';
import {CartService} from "../service/cart.service";
import {finalize} from "rxjs";
import {ConfirmationService, MessageService} from "primeng/api";
import {OrderService} from "../service/order.service";
import {paths} from "../const";
import {Router} from "@angular/router";
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare const template: any;
declare const Razorpay: any;

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
  createSuccess: boolean = false;
  payonline : boolean = false;
  productImage: { [key: number]: SafeUrl } = {};

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private confirmationService: ConfirmationService
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
            this.getProductImage('product', order.productId.image, order.productId.id);
          })
        })
    }

  }

  ngAfterViewInit() {
    try {
      template.init();
    } catch (e){
      console.log(e)
    }
    this.loadData();
  }

  checkInValidForm() {
    return !(this.account.address && this.account.phone && this.account.email && this.account.username && this.account.fullName)
  }

  confirm(event: Event) {
    if(!this.payonline) {
      this.checkoutCart();
      return;
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to pay online this bill?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.checkoutCart();
      },
      reject: () => {
        this.payonline = false;
      }
    });
  }
  checkoutCart() {

    if (this.checkInValidForm()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please fill all info'});
      return;
    }

    const billDetail = this.orderDetails.map((order: any) => {
      return {productId: order.productId.id, quantity: order.quantity}
    })
    if(billDetail.length < 1) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please choose product...'});
      this.payonline = false;
      return;
    }
    const param = {
      account: this.account,
      bill: this.bill,
      billDetails: billDetail,
      payonline : this.payonline
    }
    this.orderService.createBill(param).subscribe({
      next: (res) => {
        if (this.payonline){
          const response = res.response;
          this.openTransactionModal(response);
        } else {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Create bill success'});
          this.createSuccess = true;
          window.location.reload();
        }
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

  openTransactionModal(response: any) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'NEST',
      description: 'Payment of online shopping',
      image: 'https://cdn.pixabay.com/photo/2023/01/22/13/46/swans-7736415_640.jpg',
      handler: (res: any) => {
        if(res!= null && res.razorpay_payment_id != null) {
          this.processResponse(response.billId, res);
        } else {
          alert("Payment failed..")
        }

      },
      prefill : {
        name:'NEST',
        email: 'NEST@GMAIL.COM',
        contact: '90909090'
      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(billId: any, res : any){
    this.orderService.updateTransaction({
      id : billId,
      paymentId: res.razorpay_payment_id
    }).subscribe(() =>{
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Create bill success'});
      this.createSuccess = true;
      window.location.reload();
    })
  }

  getProductImage(type: string, filename: string, productId: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageData));
      this.productImage[productId] = imageUrl;
    });
  }
}
