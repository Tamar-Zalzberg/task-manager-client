import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  // כתובות השרת לפי מסמך הדרישות
  private apiUrlTasks = 'http://localhost:3000/api/tasks';
  private apiUrlComments = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) {}

  // פונקציית עזר לטוקן (חובה לכל בקשה לשרת)
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // --- משימות (עבודה מול השרת) ---

  // 1. קבלת משימות לפי פרויקט
  getTasks(projectId: string): Observable<any> {
    // השרת מצפה לקבל projectId
    // אם השרת שלך תומך בסינון לפי ID ב-Query Param:
    return this.http.get(`${this.apiUrlTasks}?projectId=${projectId}`, this.getHeaders());
    // הערה: בחלק מהשרתים זה עובד ככה: return this.http.get(`${this.apiUrlTasks}/${projectId}`, this.getHeaders());
    // לפי המסמך ששלחת: "GET /api/tasks (מוגן)... תומך במסנן projectId"
  }

  // 2. יצירת משימה חדשה
  createTask(task: any, projectId: string): Observable<any> {
    const taskData = { 
      ...task, 
      projectId: projectId // מוודאים שהמשימה משויכת לפרויקט הנכון
    };
    return this.http.post(this.apiUrlTasks, taskData, this.getHeaders());
  }

  // 3. מחיקת משימה
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrlTasks}/${taskId}`, this.getHeaders());
  }

  // 4. עדכון סטטוס משימה (PATCH)
  updateTaskStatus(taskId: string, status: string): Observable<any> {
    const body = { status: status };
    return this.http.patch(`${this.apiUrlTasks}/${taskId}`, body, this.getHeaders());
  }

  // --- תגובות (החלק החדש!) ---

  // 5. קבלת תגובות למשימה
  getComments(taskId: string): Observable<any> {
    // לפי ההוראות: GET /api/comments?taskId=...
    return this.http.get(`${this.apiUrlComments}?taskId=${taskId}`, this.getHeaders());
  }

  // 6. הוספת תגובה חדשה
  addComment(commentData: { taskId: string; body: string }): Observable<any> {
    // לפי API documentation: POST /api/comments
    // Body: { "taskId": 1, "body": "Looks good" }
    return this.http.post(this.apiUrlComments, commentData, this.getHeaders());
  }
}