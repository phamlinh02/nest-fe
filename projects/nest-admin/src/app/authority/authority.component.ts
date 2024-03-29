import { AfterViewInit, Component } from '@angular/core';
import { paths } from "../const";
import { AccountService } from '../service/account.service';
import { AuthorityService } from '../service/authority.service';
import { Router } from '@angular/router';
import { UploadsService } from '../service/uploads.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RoleService } from '../service/role.service';
import { TokenStorageService } from '../service/token-storage.service';

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
  userRole: string = '';


  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private authorityService: AuthorityService,
    private roleService: RoleService,
    private token : TokenStorageService
  ) { 
    if (!this.token.isLoggedIn()) {
      document.body.classList.add('abc');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    const userString = this.token.getUser();
    if (userString) {
      this.userRole = userString.roleName;
    if(this.userRole === 'ROLE_ADMIN'){
      alert('You do not have permission to access this page');
      this.router.navigate(['/home']);
    }
    else {
      this.getAllAuthorities();
      this.showRoles();
      template.init();
    }
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


  showRoles() {
    this.roleService.getAllRolesIsActive().subscribe((data: any) => {
      this.roles = data.response.content;
      console.log(this.roles);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách vai trò ', error);
      });
  }

  updateRole(authority: any) {
    const updateAuthorityDTO = { roleId: authority.roleId };
    this.authorityService.updateAuthorityRole(authority.id, updateAuthorityDTO).subscribe(
      () => {
        alert('Role updated successfully');
        console.log('Role updated successfully');
      },
      (error) => {
        alert('Error updating role');
        console.error('Error updating role', error);
      }
    );
  }

}
