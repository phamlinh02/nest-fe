import {AfterViewInit, Component} from '@angular/core';
import { paths } from '../../const';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { ActivatedRoute } from '@angular/router';

declare let template: any;

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
})
export class AccountDetailComponent implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;
  account: any = {};
  accountId: number = 1;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
  ){
  }

  ngAfterViewInit() {
    template.init();
    this.showAccountByUsername();
  }

  showAccountByUsername(){
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.accountId = id;
        this.accountService.getUserByUsername(this.accountId).subscribe(
          (data: any) => {
            this.account = data.response;
            console.log(this.account);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết account: ', error);
          }
        );
      }
    });
  }

}
