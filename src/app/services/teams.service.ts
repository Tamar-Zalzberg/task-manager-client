import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // נשמור על השימוש ב-AuthService שלך
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = 'http://localhost:3000/api/teams';

  // אנחנו מזריקים את AuthService כמו בקוד שלך - זה מצוין
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    // לוקחים את הטוקן דרך השירות בצורה מסודרת
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // חשוב להוסיף כדי שהשרת יבין את המידע
      })
    };
  }

  // 1. קבלת צוותים (היה לך)
  getTeams(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  // 2. יצירת צוות (היה לך)
  createTeam(team: any): Observable<any> {
    return this.http.post(this.apiUrl, team, this.getHeaders());
  }

  // --- הפונקציות החדשות שחייבים להוסיף ---

  // 3. הוספת משתמש לצוות
  addMemberToTeam(teamId: string, userId: string, role: string = 'member'): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/members`;
    // לפי API: POST /api/teams/:teamId/members
    // Body: { "userId": 2, "role": "member" }
    // שלח userId כ-number
    return this.http.post(url, { userId: Number(userId), role: role }, this.getHeaders());
  }

  // קבלת פרטי צוות יחיד
  getTeam(teamId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${teamId}`, this.getHeaders());
  }

  // הסרת חבר מהצוות
  removeMember(teamId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/members/${userId}`;
    return this.http.delete(url, this.getHeaders());
  }

  // מחיקת צוות
  deleteTeam(teamId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}`, this.getHeaders());
  }

  // חיפוש משתמש לפי אימייל
  searchUserByEmail(email: string): Observable<any> {
    const url = 'http://localhost:3000/api/auth/search-user';
    return this.http.get(`${url}?email=${encodeURIComponent(email)}`, this.getHeaders());
  }

  // קבלת רשימת כל המשתמשים
  getAllUsers(): Observable<any[]> {
    const url = 'http://localhost:3000/api/auth/users';
    return this.http.get<any[]>(url, this.getHeaders());
  }
}