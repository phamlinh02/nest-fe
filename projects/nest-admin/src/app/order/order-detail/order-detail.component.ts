import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {OrderService} from "../../service/order.service";
import { UploadsService } from '../../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface ProductImageMap {
  [productId: number]: SafeUrl;
}

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {

  orderDetail: any;
  billId: any;
  loading: boolean = false;
  listStatus : any = [
    {code : 'COMPLETED', value : 'Completed'},
    {code : 'PENDING', value : 'Pending'},
    {code : 'NEW', value : 'New'},
    {code : 'CANCELLED', value : 'Canceled'},
    {code : 'PROCESSING', value : 'Processing'},
  ]
  statusSelected : any;
  productImage: ProductImageMap = {};
  accountAvatar: SafeUrl | undefined;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
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
        next: response => {
          this.orderDetail = response.response;
          this.statusSelected = this.orderDetail.bill.status;

          if (this.orderDetail && this.orderDetail.account.avatar) {
            this.getAccountAvatar('account', this.orderDetail.account.avatar);
          }
          this.orderDetail.billDetails.forEach((product: any) => {
            this.orderDetail.billDetails.forEach((product: any) => {
              this.getProductImage('product', product.productDTO.image, product.productDTO.id);
            });
        });
        },
        error: err => {
          alert(`Don't have this order`);
          this.router.navigate(['/home']);
        }
      })
  }

  checkDisable(){
   return this.orderDetail.bill.status === 'CANCELED' || this.orderDetail.bill.status === 'COMPLETED'
  }
  saveBillDetail() {
    if(!this.statusSelected) return;
    if(this.checkDisable()) return;

    this.orderDetail.bill.status = this.statusSelected;
    this.loading = true;
    this.orderService.saveBill(this.orderDetail.bill)
      .pipe(finalize(() =>{
        this.loading = false;
        this.loadData();
      }))
      .subscribe({
        next: response => {

        },
        error: err => {
          alert(`Something went wrong, try again`);
        }
      })
  }
  getProductImage(type: string, filename: string, productId: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[productId] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  getAccountAvatar(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.accountAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }


}
