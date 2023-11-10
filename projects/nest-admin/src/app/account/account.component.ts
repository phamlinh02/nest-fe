import {AfterViewInit, Component} from '@angular/core';
import { paths } from "../const";
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare const template: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent  implements AfterViewInit{
  title = 'nest-customer';
  accounts: any[] = [];
  paths = paths;
  userAvatars: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  

  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
  ){}

  ngAfterViewInit(){
    template.init();
    this.getAllUsers();
  }

  getAllUsers() {
    this.accountService.getAllUsers(this.currentPage, 8).subscribe((data: any) => {
      this.accounts = data.response.content;
      this.totalPages = Math.ceil(data.response.totalElements / 8);
      this.accounts.forEach((account, index) => {
        this.getUserAvatar('account', account.avatar, index);
      });
      console.log(this.accounts);
    }, (error) => {
      console.error('Lỗi khi tải danh sách Users ', error);
    });
  }

  getUserAvatar(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatars[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllUsers();
    }
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
}
