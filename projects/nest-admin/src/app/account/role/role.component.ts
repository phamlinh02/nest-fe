import {AfterViewInit, Component} from '@angular/core';
import { RoleService } from '../../service/role.service';
import { ActivatedRoute } from '@angular/router';
import { paths } from '../../const';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';

declare let template: any;

@Component({
  selector: 'app-categories',
  templateUrl: './role.component.html',
})
export class RolesComponent implements AfterViewInit{
  title = 'nest-customer';
  roles: any[] = [];
  role: any = {};
  roleId: number = 0;
  paths = paths;
  roleName: string = '';
  errorMessage: string = '';

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ){

  }
  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showRoles();
      this.showRoleById();
    }
   
  }

  showRoles() {
    this.roleService.getAllRole().subscribe((data: any) => {
      this.roles = data.response.content;
      console.log(this.roles);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách vai trò ', error);
      });
  }

  showRoleById(){
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.roleId = id;
        this.roleService.getRoleId(this.roleId).subscribe(
          (data: any) => {
            this.role = data.response;
            this.roleName = this.role.roleName;
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết role ', error);
          }
        );
      }
    });
  }

  updateRole() {
    const formData = new FormData();

    formData.append('id', this.role.id);
    formData.append('roleName', this.role.roleName);
    formData.append('isActive', this.role.isActive);
  
    this.roleService.updateRole(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Product update failed, please check information...!';
      }
    );
  }

  saveRole() {
    const formData = new FormData();
    formData.append('roleName', this.role.roleName);
    formData.append('isActive', this.role.isActive);

    this.roleService.createRole(formData).subscribe(
      (response) => {
        console.log('Role saved successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Role save failed, please check information...!';
      }
    );
  }

  deleteRole(roleId: number) {
    this.roleService.deleteRole(roleId).subscribe(
      (response) => {
        this.showRoleById();
        this.showRoles();
        console.log('Trạng thái vai trò đã được cập nhật thành công');
      },
      (error) => {
        this.errorMessage = 'Lỗi khi cập nhật trạng thái vai trò';
        console.error('Lỗi khi cập nhật trạng thái vai trò', error);
      }
    );
  }


}
