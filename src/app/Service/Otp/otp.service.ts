import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../Config/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) { }
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api/otp';

  requestOtp(email:any): Observable<any> {
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/send`,email, { observe: 'response' }).pipe(
      map((response) => response.body)
    );
  }
  verifyOtp(email_otp:any): Observable<any> {
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/verify`,email_otp, { observe: 'response' }).pipe(
      map((response) => response.body)
    );
  }
}
