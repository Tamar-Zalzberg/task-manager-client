import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://wolf-server-dzci.onrender.com/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem(this.tokenKey);
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // הפונקציה שהחץ (הגלילה) צריכה
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getHeaders());
  }

  // הפונקציה שגרמה לקריסת ה-Deploy - עכשיו היא חזרה!
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((res: any) => { if (res.token) localStorage.setItem(this.tokenKey, res.token); })
    );
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((res: any) => { if (res.token) localStorage.setItem(this.tokenKey, res.token); })
    );
  }

  getToken() { return localStorage.getItem(this.tokenKey); }
  logout() { localStorage.removeItem(this.tokenKey); }
}