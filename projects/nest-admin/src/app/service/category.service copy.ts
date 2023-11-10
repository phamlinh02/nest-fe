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
    
      getAllCategories(): Observable<any[]> {
        return this.http.get<any[]>(CATEGORY_API + '/get-all');
      }
    
}