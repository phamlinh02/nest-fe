import { Component, AfterViewInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../const';

declare const template: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit{
  title = 'nest-customer';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  fullName: string = '';
  errorMessage: string = '';
  agreeToTerms: boolean = false;
  paths = paths;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
  }

  ngAfterViewInit(){
    template.init();
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match.';
      return;
    }
    if (!this.agreeToTerms) {
      this.errorMessage = 'You must agree to the terms and policies before registering.';
      return; 
    }
    const account = {
      username: this.username,
      password: this.password,
      email: this.email,
      fullName: this.fullName
    };
    

    this.accountService.registerUser(account).subscribe
      ((response) => {
        console.log('Sign Up Success!!!', response);
        this.router.navigate(['/login']);
      },
        (error) => {
          this.errorMessage = 'Registration failed. Please check your registration information.';
        }

      )

  }

}