import { AfterViewInit, Component } from '@angular/core';
import { paths } from '../../const';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../../service/uploads.service';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { TokenStorageService } from '../../service/token-storage.service';

declare let template: any;

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
})
export class AccountDetailComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  account: any = {};
  accountId: number = 1;
  userAvatar!: SafeUrl;
  avatarFile: File | null = null;
  errorMessage: string = '';
  roles: any[] = [];
  userRole: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private roleService: RoleService,
    private token : TokenStorageService
  ) {
    if (!this.token.isLoggedIn()) {
      document.body.classList.add('abc');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.showAccountById();
    this.showRoles();
    template.init();
  }

  showAccountById() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.accountId = id;
        this.accountService.getUserByUsername(this.accountId).subscribe(
          (data: any) => {
            this.account = data.response;
            this.checkAccessPermission();
            this.getUserAvatar('account', this.account.avatar);
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
    formData.append('isActive', this.account.isActive);

    const userString = this.token.getUser();
    if (userString) {
      this.accountService.userRole = userString.roleName;

      console.log('UserRole:', this.accountService.userRole);
    }
    if (this.accountService.hasAdminRole() && this.account.roleName !== 'ROLE_CUSTOMER') {
      alert('There is no permission to delete updates with the current role.');
      console.error('Không có quyền cập nhật tài khoản với vai trò hiện tại.');
      window.location.reload();
      return;
    }
    else {
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

  onAvatarChange(event: any) {
    this.avatarFile = event.target.files[0];
    if (this.avatarFile) {
      const imageUrl = URL.createObjectURL(this.avatarFile);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  getUserAvatar(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  checkAccessPermission() {
    const userString = this.token.getUser();
    if (userString) {
      this.userRole = userString.roleName;
      if (this.userRole === 'ROLE_ADMIN') {
        {
          if (this.account.roleName === 'ROLE_DIRECTOR') {
            alert('You do not have permission to access this page.');
            this.router.navigate(['/account']);
          }
        }
      }
    }
  }
}
