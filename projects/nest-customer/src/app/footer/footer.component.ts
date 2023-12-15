import { Component, OnInit } from '@angular/core';
import { paths } from '../const';
import { CategoryService } from "../service/category.service";

declare let template: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit{
  title = 'nest-customer';
  paths = paths;
  categories: any[] = [];

  constructor(
    private categoryService: CategoryService,
  ){}

  ngOnInit(): void {
    this.showCategory();
  }

  showCategory() {
    this.categoryService.getAllCategoriesIsActive(0, 100).subscribe((data: any) => {
      this.categories = data.response.content;
      console.log(this.categories);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
      });
  }

}
