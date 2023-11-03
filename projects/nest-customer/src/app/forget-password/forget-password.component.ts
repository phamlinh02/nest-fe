import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../const';

declare const template: any;

@Component({
  selector: 'forgot-password',
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent implements OnInit{
  title = 'nest-customer';
  username: string = '';
  email: string = '';
  message: string = '';
  paths = paths;
  agreeToTerms: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ){
  }

  ngOnInit() {
    template.init();
  }

  forgetPassword(){
    if (!this.agreeToTerms) {
      this.message = 'You must agree to the terms and policies before registering.';
      return; 
    }
    const forgetPassDTO = {
      username : this.username,
      email : this.email
    };

    this.isProcessing = true;
    this.message = 'A new password will be sent to your email address, please wait a moment...';

    this.accountService.forgetPassword(forgetPassDTO).subscribe
      ((response) => {
        this.isProcessing = false;
        console.log('A new password will be sent to your email address, please wait a moment...', response);
        this.message = 'A new password will be sent to your email address, please wait a moment...';
        this.router.navigate(['/login']);
        
      },
        (error) => {
          this.isProcessing = false;
          this.message = 'Password change failed, please check the information!';
        }

      )
  }
}
