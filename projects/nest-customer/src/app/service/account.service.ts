import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const ACCOUNT_API = `${SERVER_URL}/api/nest/account`;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  userRole: string = '';

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  hasAdminOrDirectorRole(): boolean {
    console.log('UserRole in hasAdminOrDirectorRole:', this.userRole);
    return this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_DIRECTOR';
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${ACCOUNT_API}/get-all`);
  }

  saveUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/save`, account);
  }

  updateUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/update`, account);
  }

  updateAccountByUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/updateByUser`, account);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${ACCOUNT_API}/get-user?username=${username}`);
  }

  registerUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/register`, account);
  }

  loginUser(payload: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/login`, payload);
  }

  changePassword(changePassDTO: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/update-pass`, changePassDTO);
  }

  forgetPassword(forgetPassDTO: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/forget-pass`, forgetPassDTO);
  }
 
}