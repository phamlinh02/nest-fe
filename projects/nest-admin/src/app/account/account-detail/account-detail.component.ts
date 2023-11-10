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
  userAvatar!: SafeUrl;
  avatarFile: File | null = null;
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ){
  }

  ngAfterViewInit() {
    template.init();
    this.showAccountById();
  }

  showAccountById(){
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.accountId = id;
        this.accountService.getUserByUsername(this.accountId).subscribe(
          (data: any) => {
            this.account = data.response;
            this.getUserAvatar('account',this.account.avatar);
            console.log(this.account);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết account: ', error);
          }
        );
      }
    });
  }

  updateAccount() {
    const formData = new FormData();
  
    if (this.avatarFile) {
      formData.append('avatarFile', this.avatarFile);
    }
  
    formData.append('id', this.account.id);
    formData.append('username', this.account.username);
    formData.append('email', this.account.email);
    formData.append('fullName', this.account.fullName);
    formData.append('address', this.account.address);
    formData.append('phone', this.account.phone);
    formData.append('roleName', this.account.roleName);
  
    this.accountService.updateUser(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Account update failed, please check information...!';
      }
    );
  }

  onAvatarChange(event: any) {
    this.avatarFile = event.target.files[0];
    if (this.avatarFile) {
      const imageUrl = URL.createObjectURL(this.avatarFile);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  getUserAvatar(type: string,filename: string) {
    this.uploadsService.getImage(type,filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

}
