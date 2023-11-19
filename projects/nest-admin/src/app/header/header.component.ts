import {AfterViewInit, Component} from '@angular/core';
import { paths } from '../const';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;

  ngAfterViewInit() {
  }

  logout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Xóa thông tin giỏ hàng
  }
}
