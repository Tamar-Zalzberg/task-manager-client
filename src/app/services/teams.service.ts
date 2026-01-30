import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = 'http://localhost:3000/api/teams';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getTeams(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  createTeam(team: any): Observable<any> {
    return this.http.post(this.apiUrl, team, this.getHeaders());
  }

  addMemberToTeam(teamId: string, userId: string, role: string = 'member'): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/members`;
    return this.http.post(url, { userId: Number(userId), role: role }, this.getHeaders());
  }

  getTeam(teamId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${teamId}`, this.getHeaders());
  }

  removeMember(teamId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/members/${userId}`;
    return this.http.delete(url, this.getHeaders());
  }

  deleteTeam(teamId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}`, this.getHeaders());
  }

  searchUserByEmail(email: string): Observable<any> {
    const url = 'http://localhost:3000/api/auth/search-user';
    return this.http.get(`${url}?email=${encodeURIComponent(email)}`, this.getHeaders());
  }

  getAllUsers(): Observable<any[]> {
    const url = 'http://localhost:3000/api/auth/users';
    return this.http.get<any[]>(url, this.getHeaders());
  }
}