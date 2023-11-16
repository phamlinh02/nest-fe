import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const REPORT_API = `${SERVER_URL}/api/nest/report`;

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private http: HttpClient) { }

    getAllQtyProduct(): Observable<number> {
        return this.http.get<number>(`${REPORT_API}/getProduct`);
    }

    getQtyOrder(): Observable<number> {
        return this.http.get<number>(`${REPORT_API}/getOrder`);
    }

    getRevenue(): Observable<number> {
        return this.http.get<number>(`${REPORT_API}/getRevenue`);
    }

    getQtyOrderInMonth(): Observable<number> {
        return this.http.get<number>(`${REPORT_API}/monthly`);
    }
}