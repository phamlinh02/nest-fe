import {AfterViewInit, Component} from '@angular/core';
import { paths } from '../../const';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../service/role.service';

declare let template: any;

@Component({
  selector: 'add-account',
  templateUrl: './account-add.component.html',
})
export class AddAccountComponent implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;
  account: any = {};
  accountId: number = 1;
  userAvatar!: SafeUrl;
  avatarFile: File | null = null;
  errorMessage: string = '';
  roles: any[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private roleService: RoleService
  ){
  }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showAccountById();
      this.showRoles();
    }
    
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

  saveAccount() {
    const formData = new FormData();
    formData.append('id', this.account.id);
    formData.append('username', this.account.username);
    formData.append('email', this.account.email);
    formData.append('fullName', this.account.fullName);
    formData.append('address', this.account.address);
    formData.append('phone', this.account.phone);
    formData.append('roleName', this.account.roleName);

    if (this.avatarFile) {
      formData.append('avatarFile', this.avatarFile);
    }

    if (this.account.password) {
      formData.append('password', this.account.password);
    }

    this.accountService.saveUser(formData).subscribe(
      (response) => {
        console.log('Account saved successfully!', response);
        this.router.navigate(['/account']);
        window.location.reload;
      },
      (error) => {
        this.errorMessage = 'Account save failed, please check information...!';
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

  showRoles() {
    this.roleService.getAllRolesIsActive().subscribe((data: any) => {
      this.roles = data.response.content;
      console.log(this.roles);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách vai trò ', error);
      });
  }

}
