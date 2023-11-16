import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../../nest-customer/src/app/service/order.service";

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
    status: string
  } = {
    searchName: '',
    status: ''
  }

  constructor(
    private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const param = {}
    this.orderService.getAllOrder(param).subscribe((response) => {
      this.listOrder = this.listOrderFilter = response.response.content;
      this.paging = response.response;
      for (let i = 0; i < this.paging.totalPages; i++) {
        this.listPage.push(i + 1)
      }
    })
  }

  onSearchOrder() {
    this.listOrderFilter = this.listOrder.filter((order: any) =>
      ((order.username.toLocaleLowerCase().includes(this.filter.searchName.toLocaleLowerCase())) ||
        (order.fullName.toLocaleLowerCase().includes(this.filter.searchName.toLocaleLowerCase())) ||
        (order.email.toLocaleLowerCase().includes(this.filter.searchName.toLocaleLowerCase())) ||
        (order.id == this.filter.searchName.toLocaleLowerCase())
      ) &&
      ((this.filter.status != '' && this.filter.status.toLocaleLowerCase() == order.status.toLocaleLowerCase()) ||
        this.filter.status.toLocaleLowerCase() == 'show all' || this.filter.searchName == ''
      )
    )
  }
}
