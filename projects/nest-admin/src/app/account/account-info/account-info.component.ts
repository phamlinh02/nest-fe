import {AfterViewInit, Component} from '@angular/core';
import { paths } from '../../const';
import { AccountService } from '../../service/account.service';
import { UploadsService } from '../../service/uploads.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { TokenStorageService } from '../../service/token-storage.service';

declare const template: any;

@Component({
  selector: 'app-account',
  templateUrl: './account-info.component.html',
})
export class AccountInfoComponent  implements AfterViewInit{
  title = 'nest-customer';
  user: any;
  paths = paths;
  avatarFile: File | null = null;
  userAvatar!: SafeUrl;
  errorMessage: string = '';
  

  constructor(
    private accountService: AccountService,
    private uploadsService: UploadsService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private token: TokenStorageService
  ){
    const userData = this.token.getUser();
    if (!this.token.isLoggedIn()) {
        this.router.navigate(['/login']);
    }else{
    if (userData) {
      this.getUserAvatar('account', userData.avatar); 
      console.log(userData);
    }
    }
  }

  ngAfterViewInit(){
    template.init(); 
      
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
  getUserAvatar(type: string, filename: string) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.userAvatar = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

 
}
