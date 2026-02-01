import { HttpClient, HttpHeaders } from '@angular/common/http'; // הוספנו HttpHeaders
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs'; // הוספנו Observable

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://wolf-server-dzci.onrender.com/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  // פונקציה עזר לקבלת הטוקן לכותרות (הכרחי כדי לגשת לרשימת משתמשים)
  private getHeaders() {
    const token = localStorage.getItem(this.tokenKey);
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- הפונקציה שחסרה לך וגורמת לחץ לא לעבוד! ---
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getHeaders());
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}