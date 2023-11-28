import { AfterViewInit, Component } from '@angular/core';
import { paths } from "../const";
import { AccountService } from '../service/account.service';
import { AuthorityService } from '../service/authority.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RoleService } from '../service/role.service';

declare const template: any;

@Component({
  selector: 'app-account',
  templateUrl: './authority.component.html',
})
export class AuthorityComponent implements AfterViewInit {
  title = 'nest-customer';
  authorities: any[] = [];
  paths = paths;
  userAvatars: { [key: number]: SafeUrl } = {};
  currentPage: number = 0;
  totalPages: number = 0;
  updateData: { roleId: number }[] = [];
  roles: any[] = [];
  authority: any = {};


  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private authorityService: AuthorityService,
    private roleService: RoleService
  ) { }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      document.body.classList.add('abc');
      this.router.navigate(['/login']);
    } else {
      this.getAllAuthorities();
      this.showRoles();
      template.init();
    }

  }

  getAllAuthorities() {
    this.authorityService.getAllAuthoritys(this.currentPage, 8).subscribe((data: any) => {
      this.authorities = data.response.content;
      this.totalPages = Math.ceil(data.response.totalElements / 8);
      this.authorities.forEach((account, index) => {
        this.getUserAvatar('account', account.avatar, index);
      });
      console.log(this.authorities);
    }, (error) => {
      console.error('Lỗi khi tải danh sách Authorities ', error);
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
      this.getAllAuthorities();
    }
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  
  updateAuthority() {
    const formData = new FormData();
  
    formData.append('id', this.authority.id);
    formData.append('roleId', this.authority.roleId);

    this.authorityService.updateAuthority(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        window.location.reload();
      },
      (error) => {
        console.log('Account update failed, please check information...!');
      }
    );
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
