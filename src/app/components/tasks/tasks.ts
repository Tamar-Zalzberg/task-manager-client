import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog';
import { MessageDialogComponent } from '../dialogs/message-dialog/message-dialog';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,      // חובה עבור mat-icon
    MatCheckboxModule,  // חובה עבור mat-checkbox
    MatButtonModule,    // חובה עבור mat-button
    MatDialogModule,
    MatTooltipModule,
    ShortenPipe
  ],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  taskForm: FormGroup;
  currentProjectId: string = '';

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.paramMap.get('projectId') || '';
    if (!this.currentProjectId) this.currentProjectId = localStorage.getItem('currentProjectId') || '';

    if (this.currentProjectId) {
      localStorage.setItem('currentProjectId', this.currentProjectId);
      this.loadTasks();
    } else {
      this.showError('שגיאה', 'לא התקבל מזהה פרויקט');
    }
  }

  showError(title: string, message: string) {
    this.dialog.open(MessageDialogComponent, {
      width: '350px',
      data: { title, message, isError: true }
    });
  }

  loadTasks() {
    this.tasksService.getTasks(this.currentProjectId).subscribe({
      next: (data: any) => {
        this.tasks = data.map((t: any) => ({
          ...t,
          showComments: false,
          comments: [],
          newCommentText: ''
        }));
      },
      error: (err: any) => this.showError('תקלה', 'שגיאה בטעינת המשימות מהשרת')
    });
  }

  createTask() {
    if (this.taskForm.valid && this.currentProjectId) {
      this.tasksService.createTask(this.taskForm.value, this.currentProjectId).subscribe({
        next: (newTask: any) => {
          newTask.showComments = false; newTask.comments = []; newTask.newCommentText = '';
          this.tasks.push(newTask);
          this.taskForm.reset();
        },
        error: (err: any) => this.showError('אופס', 'לא הצלחנו ליצור את המשימה')
      });
    }
  }

  deleteTask(task: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'מחיקת משימה',
        message: 'האם את בטוחה שאת רוצה למחוק את המשימה הזו?',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = task._id || task.id;
        this.tasksService.deleteTask(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => (t._id || t.id) !== id);
          },
          error: (err: any) => this.showError('שגיאה', 'לא הצלחנו למחוק את המשימה מהשרת')
        });
      }
    });
  }

  toggleTaskStatus(task: any) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const id = task._id || task.id;
    this.tasksService.updateTaskStatus(id, newStatus).subscribe({
      next: () => task.status = newStatus,
      error: (err: any) => {
        this.showError('שגיאה', 'עדכון הסטטוס נכשל');
        task.status = task.status === 'completed' ? 'pending' : 'completed';
      }
    });
  }

  toggleComments(task: any) {
    task.showComments = !task.showComments;
    if (task.showComments && task.comments.length === 0) {
      const id = task._id || task.id;
      this.tasksService.getComments(id).subscribe({
        next: (comments: any) => task.comments = comments,
        error: (err: any) => console.error(err)
      });
    }
  }

  addComment(task: any) {
    if (!task.newCommentText?.trim()) return;
    const id = task._id || task.id;
    const commentData = { taskId: id, body: task.newCommentText };

    this.tasksService.addComment(commentData).subscribe({
      next: (newComment: any) => {
        task.comments.push({
          user: { username: 'אני' },
          content: newComment.body,
          ...newComment
        });
        task.newCommentText = '';
      },
      error: (err: any) => this.showError('שגיאה', 'התגובה לא נשלחה')
    });
  }

  goBack() { window.history.back(); }
}