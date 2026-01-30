import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://localhost:3000/api/projects';
  private teamsUrl = 'http://localhost:3000/api/teams';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // קבלת כל הפרויקטים (לפי טים אם צריך)
  getProjects(teamId?: string): Observable<any> {
    // השרת מחזיר את כל הפרויקטים של המשתמש
    // אנחנו מסננים בצד הקליינט לפי teamId
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  // יצירת פרויקט חדש
  createProject(project: { teamId: string; name: string; description?: string }): Observable<any> {
    return this.http.post(this.apiUrl, project, this.getHeaders());
  }

  // עדכון פרויקט
  updateProject(projectId: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}`, updates, this.getHeaders());
  }

  // קבלת פרויקט לפי id
  getProject(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}`, this.getHeaders());
  }

  // מחיקת פרויקט
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`, this.getHeaders());
  }

  // קבלת פרטי הצוות עם רשימת חברים
  getTeamDetails(teamId: string): Observable<any> {
    return this.http.get(`${this.teamsUrl}/${teamId}`, this.getHeaders());
  }

  // הוספת חבר לצוות
  addTeamMember(teamId: string, userId: string, role: string = 'member'): Observable<any> {
    return this.http.post(`${this.teamsUrl}/${teamId}/members`, { userId: Number(userId), role }, this.getHeaders());
  }

  // הסרת חבר מצוות
  removeTeamMember(teamId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.teamsUrl}/${teamId}/members/${userId}`, this.getHeaders());
  }
}
