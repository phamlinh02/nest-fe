import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const CATEGORY_API = `${SERVER_URL}/api/nest/category`;

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllCategoriesIsActive(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(CATEGORY_API + `/get-all-active?page=${page}&size=${size}`);
  }

  getAllCategories(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${CATEGORY_API}/get-all?page=${page}&size=${size}`);
  }
  getCategoryId(id: number): Observable<any> {
    return this.http.get(`${CATEGORY_API}/get-category?id=${id}`);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.post(`${CATEGORY_API}/update`, category);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${CATEGORY_API}/save`,category);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.post(`${CATEGORY_API}/update-status`, { id: categoryId, isActive: false });
  }

}
