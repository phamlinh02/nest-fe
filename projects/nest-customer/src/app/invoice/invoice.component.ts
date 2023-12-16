import {AfterViewInit, Component} from '@angular/core';
import {OrderService} from "../service/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {paths} from "../const";
import {MessageService} from "primeng/api";
import {finalize} from "rxjs";
import { TokenStorageService } from '../service/token-storage.service';

declare const template: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements AfterViewInit {
  title = 'nest-customer';
  billId: string = '';
  billDetails: any;
  bill: any;
  account: any;
  loading : boolean = true;
  totalPrice : any = 0;
  tax = 10;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService : MessageService,
    private token: TokenStorageService
  ) {
    this.billId = this.route.snapshot.paramMap.get('slug') ?? '';
  }

  ngAfterViewInit() {
    template.init();
    this.account = this.token.getUser();
    if (!this.account || !this.billId) {
      this.router.navigate([paths.home]);
    }

    this.account = this.token.getUser();
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.orderService.getBillDetail(+this.billId)
      .pipe(finalize(() =>{
        this.loading = false;
      }))
      .subscribe((result) => {
      this.billDetails = result.response.billDetails;
      this.billDetails.forEach((bill : any) =>{
        this.totalPrice += bill.quantity * bill.price;
      })
      this.bill = result.response.bill;
      if(this.account.id != result.response.account.id){
        this.messageService.add({severity: 'error', summary: 'Error', detail: `You don't have this order`});
        this.router.navigate([paths.home]);
      }
    });
  }
}
