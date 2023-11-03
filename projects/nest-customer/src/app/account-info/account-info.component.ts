import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { paths } from '../const';
import { AccountService } from '../service/account.service';

declare const template: any;

@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
})
export class AccountInfoComponent implements AfterViewInit{
  title = 'nest-customer';
  user: any;
  paths = paths;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private accountService: AccountService
    ){
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData).response;
      console.log(userData);
    } 
  }
  ngAfterViewInit(){
    template.init();
  }

  updateAccountByUser(){
    this.accountService.updateAccountByUser(this.user).subscribe
      ((response) => {
        console.log('Updated successfully!', response);
        this.router.navigate(['/login']);
      },
        (error) => {
          this.errorMessage = 'Account update failed, please check information...!';
        }

      )
  }

  logout(){
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

}
