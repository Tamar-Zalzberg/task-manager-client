import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrlTasks = 'https://wolf-server-dzci.onrender.com/api/tasks';
  private apiUrlComments = 'https://wolf-server-dzci.onrender.com/api/comments';

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
  getTasks(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrlTasks}?projectId=${projectId}`, this.getHeaders());
  }

  createTask(task: any, projectId: string): Observable<any> {
    const taskData = {
      ...task,
      projectId: projectId
    };
    return this.http.post(this.apiUrlTasks, taskData, this.getHeaders());
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrlTasks}/${taskId}`, this.getHeaders());
  }

  updateTaskStatus(taskId: string, status: string): Observable<any> {
    const body = { status: status };
    return this.http.patch(`${this.apiUrlTasks}/${taskId}`, body, this.getHeaders());
  }

  getComments(taskId: string): Observable<any> {
    return this.http.get(`${this.apiUrlComments}?taskId=${taskId}`, this.getHeaders());
  }

  addComment(commentData: { taskId: string; body: string }): Observable<any> {
    return this.http.post(this.apiUrlComments, commentData, this.getHeaders());
  }
}