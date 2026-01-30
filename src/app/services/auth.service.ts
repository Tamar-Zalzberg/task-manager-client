import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // הכתובת של השרת
  private tokenKey = 'token'; // איפה נשמור את מפתח הכניסה

  constructor(private http: HttpClient) { }

  // פונקציה להרשמה
  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  // פונקציה להתחברות
  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  // פונקציה לקבלת הטוקן
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // בדיקה אם המשתמש מחובר
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // יציאה מהמערכת
  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}