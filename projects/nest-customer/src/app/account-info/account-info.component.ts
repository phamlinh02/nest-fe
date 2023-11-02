import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { paths } from '../const';
@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
})
export class AccountInfoComponent {
  title = 'nest-customer';
  user: any;
  paths = paths;

  constructor(private router: Router){
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData).response;
      console.log(userData);
    } else {
      // Xử lý trường hợp nếu dữ liệu không tồn tại
      // Ví dụ: Gán giá trị mặc định cho this.user
      this.user = { username: 'Guest' };
    }
  }

  logout(){
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  

}
