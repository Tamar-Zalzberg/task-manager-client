import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // כתובת הבסיס לשרת ב-Render
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

  // הפונקציה שמביאה משתמשים - כאן הייתה השגיאה!
  getUsers(): Observable<any> {
    // השתמשתי בכתובת המלאה ישירות כדי שלא יהיה ספק
    return this.http.get('https://wolf-server-dzci.onrender.com/api/auth/users', this.getHeaders());
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        if (response.token) localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.token) localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  getToken() { return localStorage.getItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!localStorage.getItem(this.tokenKey); }
  logout() { localStorage.removeItem(this.tokenKey); }
}