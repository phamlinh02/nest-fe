import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const AUTHORITY_API = `${SERVER_URL}/api/nest/authority`;

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  getAllAuthoritys(page: number, size: number): Observable<any> {
    return this.http.get(`${AUTHORITY_API}/get-all?page=${page}&size=${size}`);
  }

  updateAuthority(authority: any): Observable<any> {
    return this.http.post(`${AUTHORITY_API}/update`, authority);
  }
 
}