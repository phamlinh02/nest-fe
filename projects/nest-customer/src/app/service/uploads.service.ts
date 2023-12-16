import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const ACCOUNT_API = `${SERVER_URL}/api/nest/uploads`;

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllImages(): Observable<string[]> {
    return this.http.get<string[]>(`${ACCOUNT_API}/list`);
  }

  getImage(type: string,filename: string): Observable<Blob> {
    return this.http.get(`${ACCOUNT_API}/image/${type}/${filename}`, { responseType: 'blob' });
  }

  getImageUrl(type: string, filename: string): string {
    return `${ACCOUNT_API}/image/${type}/${filename}`;
  }

  
}