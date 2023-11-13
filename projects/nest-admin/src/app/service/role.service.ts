import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const ROLE_API = `${SERVER_URL}/api/nest/role`;

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllRole(): Observable<any[]> {
    return this.http.get<any[]>(ROLE_API + '/get-all');
  }

  getAllRolesIsActive(): Observable<any[]> {
    return this.http.get<any[]>(ROLE_API + '/get-all-active');
  }

  updateRole(role: any): Observable<any> {
    return this.http.post(`${ROLE_API}/update`, role);
  }

  createRole(role: any): Observable<any> {
    return this.http.post(`${ROLE_API}/save`,role);
  }

  deleteRole(roleId: number): Observable<any> {
    return this.http.post(`${ROLE_API}/update-status`, { id: roleId, isActive: false });
  }

  getRoleId(id: number): Observable<any> {
    return this.http.get(`${ROLE_API}/get-role?id=${id}`);
  }

}