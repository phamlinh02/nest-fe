import {AfterViewInit, Component} from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../../const';

declare let template: any;

@Component({
  selector: 'app-login',
  templateUrl: './forgetPass.component.html',
})
export class ForgetComponent implements AfterViewInit{
  title = 'nest-customer';
  username: string = '';
  email: string = '';
  message: string = '';
  paths = paths;
  isProcessing: boolean = false;


  constructor(
    private accountService: AccountService,
    private router: Router,
  ){
  }

  ngAfterViewInit() {
    template.init();
  }
  forgetPassword(){
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
