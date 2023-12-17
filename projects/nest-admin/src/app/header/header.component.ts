import {AfterViewInit, Component} from '@angular/core';
import { paths } from '../const';
import { AccountService } from '../service/account.service';
import { UploadsService } from '../service/uploads.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { TokenStorageService } from '../service/token-storage.service';

declare let template: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;
  user: any;
  userAvatar!: SafeUrl;

  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private token: TokenStorageService
  ){
    const userData = this.token.getUser();
    if (userData) {
      this.user = userData;
      this.getUserAvatar('account', this.user.avatar);
      console.log(userData);
    }
  }

  ngAfterViewInit() {
    if(this.user){
      this.getUserAvatar('account', this.user.avatar);
    }
  }

  logout() {
    // Xóa thông tin người dùng khỏi localStorage
    this.token.signOut();
  }
  getUserAvatar(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
}
