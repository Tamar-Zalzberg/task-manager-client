import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // שתי הכתובות חייבות להצביע לשרת ב-Render
  private apiUrl = 'https://wolf-server-dzci.onrender.com/api/projects';
  private teamsUrl = 'https://wolf-server-dzci.onrender.com/api/teams'; // <--- תיקון כאן!

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getProjects(teamId?: string): Observable<any> {
    // בודק אם שלחנו teamId, אם כן מוסיף אותו כפרמטר ב-URL (query param)
    // הערה: תלוי איך השרת שלך בנוי, לפעמים זה בנתיב עצמו. כרגע נשאיר כמו שהיה.
    const url = teamId ? `${this.apiUrl}?teamId=${teamId}` : this.apiUrl;
    return this.http.get<any[]>(url, this.getHeaders());
  }

  createProject(project: { teamId: string; name: string; description?: string }): Observable<any> {
    return this.http.post(this.apiUrl, project, this.getHeaders());
  }

  updateProject(projectId: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}`, updates, this.getHeaders());
  }
  
  getProject(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}`, this.getHeaders());
  }

  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`, this.getHeaders());
  }
  
  // פונקציות שקשורות לצוות - משתמשות ב-teamsUrl המתוקן
  getTeamDetails(teamId: string): Observable<any> {
    return this.http.get(`${this.teamsUrl}/${teamId}`, this.getHeaders());
  }
  
  addTeamMember(teamId: string, userId: string, role: string = 'member'): Observable<any> {
    return this.http.post(`${this.teamsUrl}/${teamId}/members`, { userId: Number(userId), role }, this.getHeaders());
  }

  removeTeamMember(teamId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.teamsUrl}/${teamId}/members/${userId}`, this.getHeaders());
  }
}