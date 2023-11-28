import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { map } from 'rxjs/operators';

const SERVER_URL = environment.SERVER_URL;

const ACCOUNT_API = `${SERVER_URL}/api/nest/account`;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  }),
};

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
  hasAdminRole(): boolean{
    console.log('UserRole in hasAdminRole:', this.userRole);
    return this.userRole === 'ROLE_ADMIN';
  }
  hasDirectorRole(): boolean{
    console.log('UserRole in hasDirectorRole:', this.userRole);
    return this.userRole === 'ROLE_DIRECTOR';
  }

  isOwner(commentUserId: string): boolean {
    const loggedInUserId = localStorage.getItem('userId');
    return loggedInUserId === commentUserId;
  }

  getAllUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${ACCOUNT_API}/get-all?page=${page}&size=${size}`);
  }

  get4Users(): Observable<any> {
    return this.http.get(`${ACCOUNT_API}/get-all`);
  }

  saveUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/save`, account);
  }

  updateUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/update`, account);
  }
  getUserByUsername(id: number): Observable<any> {
    return this.http.get(`${ACCOUNT_API}/get-user?id=${id}`);
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

  updateAccountByUser(account: any): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/updateByUser`, account);
  }

  deleteAccount(accountId: number): Observable<any> {
    return this.http.post(`${ACCOUNT_API}/update-status`, { id: accountId, isActive: false });
  }
 
}