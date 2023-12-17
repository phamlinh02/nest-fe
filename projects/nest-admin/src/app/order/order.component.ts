import {Component, OnInit} from '@angular/core';
import {OrderService} from "../service/order.service";
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  listOrder: any;
  listOrderFilter: any = [];
  paging: any;
  pageIndex: number = 0;
  listPage: any = [];
  filter: {
    searchName: string,
    status: string,
    date : Date
  } = {
    searchName: '',
    status: '',
    date : new Date
  }

  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private token: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    if (!this.token.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadData();
    }

  }

  loadData(param : any = {}, header: any = {
    size : 10,
    page: 0
  } ) {
    if(this.filter.date){
      param = {
        ...param,
        orderDate : this.filter.date
      }
    }
    this.orderService.getAllOrder(param, header).subscribe((response) => {
      this.listOrder = this.listOrderFilter = response.response.content;
      this.paging = response.response;
      this.listPage = [];
      for (let i = 0; i < this.paging.totalPages; i++) {
        this.listPage.push(i + 1)
      }
    })
  }

  onSearchOrder() {
    let list = this.listOrder;
    if(this.filter.searchName != ''){
      list = list.filter((order : any) =>
        ((order.username.toLowerCase().includes(this.filter.searchName.toLowerCase())) ||
          (order.fullName.toLowerCase().includes(this.filter.searchName.toLowerCase())) ||
          (order.email.toLowerCase().includes(this.filter.searchName.toLowerCase())) ||
          (order.id.toString().includes(this.filter.searchName.toLowerCase()))
        )
      )
    }
    if(this.filter.status != '' && this.filter.status.toLowerCase() != 'show all'){
      list = list.filter((order : any) =>this.filter.status.toLowerCase() === order.status.toLowerCase())
    }
    this.listOrderFilter = list;
  }

  changePage(page : number){
    this.pageIndex = page -1;
    const header = {
      size: 10,
      page: page - 1
    }
    this.loadData({}, header);
  }
}
