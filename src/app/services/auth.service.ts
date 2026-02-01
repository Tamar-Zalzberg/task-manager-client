import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // כתובת ה-API הראשית ב-Render
  private apiUrl = 'https://wolf-server-dzci.onrender.com/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem(this.tokenKey);
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // זו הפונקציה שחייבת להיות מדויקת כדי שהחץ ייפתח!
getUsers(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  // הכתובת הזו חייבת להיות של Render ולא localhost!
  return this.http.get('https://wolf-server-dzci.onrender.com/api/auth/users', { headers });
}

  // שאר הפונקציות הקיימות שלך...
  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((res: any) => res.token && localStorage.setItem(this.tokenKey, res.token))
    );
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((res: any) => res.token && localStorage.setItem(this.tokenKey, res.token))
    );
  }

  getToken() { return localStorage.getItem(this.tokenKey); }
  logout() { localStorage.removeItem(this.tokenKey); }
}