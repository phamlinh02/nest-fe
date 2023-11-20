import {AfterViewInit, Component} from '@angular/core';
import { CategoryService } from '../service/category.service';
import { paths } from '../const';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';

declare let template: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements AfterViewInit {
  title = 'nest-customer';
  categories: any[] = [];
  category: any = {};
  paths = paths;
  categoryId: number = 0;
  categoryImage: { [key: number]: SafeUrl } = {};
  categoryFile: File | null = null;
  errorMessage: string = '';
  categoryImageDetail!: SafeUrl;
  currentPage: number = 0;
  totalPages: number = 0;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService,
    private accountService: AccountService,
    private router: Router
  ){}

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      template.init();
      this.showCategories();
      this.showCategoryById();
    }
    
  }

  showCategories() {
    this.categoryService.getAllCategories(this.currentPage, 5).subscribe((data: any) => {
      this.categories = data.response.content;
      this.totalPages = Math.ceil(data.response.totalElements / 5);
      this.categories.forEach((category, index) => {
        this.getAllCategoryImage('category', category.imageCategory,index);
      });
      console.log(this.categories);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
      });
  }

  showCategoryById(){
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.categoryId = id;
        this.categoryService.getCategoryId(this.categoryId).subscribe(
          (data: any) => {
            this.category = data.response;
            this.getCategoryImage('category',this.category.imageCategory);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết account: ', error);
          }
        );
      }
    });
  }

  updateCategory() {
    const formData = new FormData();
  
    if (this.categoryFile) {
      formData.append('categoryFile', this.categoryFile);
    }
  
    formData.append('id', this.category.id);
    formData.append('name', this.category.name);
    formData.append('isActive', this.category.isActive);
  
    this.categoryService.updateCategory(formData).subscribe(
      (response) => {
        console.log('Updated successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Product update failed, please check information...!';
      }
    );
  }

  saveCategory() {
    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('isActive', this.category.isActive);

    if (this.categoryFile) {
      formData.append('categoryFile', this.categoryFile);
    }

    this.categoryService.createCategory(formData).subscribe(
      (response) => {
        console.log('Category saved successfully!', response);
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Category save failed, please check information...!';
      }
    );
  }

  onCategoryChange(event: any) {
    this.categoryFile = event.target.files[0];
    if (this.categoryFile) {
      const imageUrl = URL.createObjectURL(this.categoryFile);
      this.categoryImageDetail = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  getAllCategoryImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.categoryImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  getCategoryImage(type: string,filename: string) {
    this.uploadsService.getImage(type,filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.categoryImageDetail = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.showCategories();
    }
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe(
      (response) => {
        this.showCategories();
        console.log('Trạng thái danh mục sản phẩm đã được cập nhật thành công');
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái danh mục', error);
      }
    );
  }

  range(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

}
