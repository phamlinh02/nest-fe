import { AfterViewInit, Component } from '@angular/core';
import { paths } from "../const";
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../service/token-storage.service';

declare const template: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements AfterViewInit {
  title = 'nest-customer';
  accounts: any[] = [];
  paths = paths;
  userAvatars: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  userRole: string = '';


  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private token: TokenStorageService
  ) { }

  ngAfterViewInit() {
    if (!this.token.isLoggedIn()) {
      document.body.classList.add('abc');
      this.router.navigate(['/login']);
    } else {
      this.getAllUsers();
      template.init();
    }

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

  deleteAccount(accountId: number) {
    const userString = this.token.getUser();
    if (userString) {
      this.userRole = userString.roleName;

      console.log('UserRole:', this.userRole);
    
    if (this.userRole === 'ROLE_ADMIN') {
      this.accountService.getUserByUsername(accountId).subscribe(
        (accountData) => {
          const accountRole = accountData.response.roleName;
          console.log(accountRole);
          if (accountRole === 'ROLE_CUSTOMER') {
            this.accountService.deleteAccount(accountId).subscribe(
              (response) => {
                this.getAllUsers();
                console.log('Account đã được xóa thành công');
              },
              (error) => {
                console.error('Lỗi khi xóa tài khoản', error);
              }
            );
          } else {
            alert('There is no permission to delete accounts with the current role.');
            console.error('Không có quyền xóa tài khoản với vai trò hiện tại.');
          }
        },
        (error) => {
          console.error('Lỗi khi lấy thông tin tài khoản', error);
        }
      );
    }
    if(this.userRole === 'ROLE_DIRECTOR'){
      this.accountService.deleteAccount(accountId).subscribe(
        (response) => {
          this.getAllUsers();
          console.log('Account đã được xóa thành công');
        },
        (error) => {
          console.error('Lỗi khi xóa tài khoản', error);
        }
      );
    }
  }
    
  }
}
