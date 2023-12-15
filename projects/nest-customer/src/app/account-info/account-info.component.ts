import {Component, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {paths} from '../const';
import {AccountService} from '../service/account.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UploadsService} from '../service/uploads.service';
import {OrderService} from "../service/order.service";


declare const template: any;

@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
})
export class AccountInfoComponent implements AfterViewInit {
  title = 'nest-customer';
  user: any;
  paths = paths;
  errorMessage: string = '';
  avatarFile: File | null = null;
  userAvatar!: SafeUrl;
  tabSelected = 'dashboard';
  listTab: {
    icon: string,
    title: string,
    code: string
  }[] = [
    {
      icon: 'fi-rs-settings-sliders',
      title: 'Dashboard',
      code: 'dashboard'
    }, {
      icon: 'fi-rs-shopping-bag',
      title: 'Orders',
      code: 'order'
    }, {
      icon: 'fi-rs-marker',
      title: 'My Address',
      code: 'address'
    }, {
      icon: 'fi-rs-user',
      title: 'Account Details',
      code: 'account-detail'
    }
  ];

  public listOrder: any = []

  constructor(
    private router: Router,
    private accountService: AccountService,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
    this.tabSelected = this.route.snapshot.queryParamMap.get('tab') ?? 'dashboard';

    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData).response;
      console.log(userData);
      this.getUserAvatar('account', this.user.avatar);
    }
  }
}

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
    try {
      template.init();
    } catch (e){
      console.log(e)
    }
    this.changeTab(this.tabSelected);

    this.getUserAvatar('account', this.user.avatar);
  }
}

  updateAccountByUser() {
    // Create a FormData object to send the form data with the avatar file
    const formData = new FormData();
    formData.append('avatarFile', this.avatarFile || ''); // Append the avatar file
    // Append other user information to the FormData
    formData.append('id', this.user.id);
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('fullName', this.user.fullName);
    formData.append('address', this.user.address);
    formData.append('phone', this.user.phone);

    this.accountService.updateAccountByUser(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = 'Account update failed, please check information...!';
      }
    );
  }

  onAvatarChange(event: any) {
    // Handle the file selection event and store the selected file
    this.avatarFile = event.target.files[0];

    // Create a URL for the selected image and update userAvatar
    if (this.avatarFile) {
      const imageUrl = URL.createObjectURL(this.avatarFile);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  logout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload;
  }

  getUserAvatar(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  changeTab(tab: string) {
    this.tabSelected = tab;
    this.router.navigate([paths.accountInfo], {queryParams: {tab: tab}, queryParamsHandling: "merge"})
    if (tab == 'order') {
      this.getAllBill();
    }
  }

  getAllBill() {
    const param = {
      accountId: this.user.id ?? 2
    }
    this.orderService.getAllOrder(param).subscribe((response) => {
      this.listOrder = response.response.content;
    })
  }
}
