import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {OrderService} from "../service/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {paths} from "../const";
import {ConfirmationService, MessageService} from "primeng/api";
import {finalize} from "rxjs";
import {TokenStorageService} from '../service/token-storage.service';
import {ConfirmDialogModule} from "primeng/confirmdialog";

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
  loading: boolean = true;
  totalPrice: any = 0;
  @ViewChild('reason') reasonModal !: ConfirmDialogModule
  reasonDeny: string = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private token: TokenStorageService,
    private confirmationService: ConfirmationService
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
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result) => {
        this.billDetails = result.response.billDetails;
        this.billDetails.forEach((bill: any) => {
          this.totalPrice += bill.quantity * bill.price;
        })
        this.bill = result.response.bill;
        if (this.account.id != result.response.account.id) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: `You don't have this order`});
          this.router.navigate([paths.home]);
        }
      });
  }

  openModalCancel() {
    this.confirmationService.confirm({
      header: 'Cancel Bill',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      rejectVisible: false,
      acceptVisible: false,
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'Reject cancel bill', life: 3000});
      }
    });
  }
  cancelBill(){
    if(!this.reasonDeny) return;
    this.orderService.cancelBill({
      id: this.billId,
      reasonDeny: this.reasonDeny,
      status: 'CANCELLED',
      description: ''
    }).subscribe(() =>{
      this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'This bill was canceled', life: 3000});
      this.confirmationService.close();
      this.loadData();
    })
  }
}
