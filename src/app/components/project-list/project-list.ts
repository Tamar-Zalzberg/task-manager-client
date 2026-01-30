import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeamMembersDialogComponent } from '../team-members-dialog.component'; // זה כנראה נשאר אותו דבר אם לא הזזת אותו
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog';
import { InputDialogComponent } from '../dialogs/input-dialog/input-dialog';
import { MessageDialogComponent } from '../dialogs/message-dialog/message-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatDialogModule
  ],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  teamId: string = '';
  newProjectName: string = '';
  teamDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('teamId') || localStorage.getItem('currentTeamId') || '';
    if (this.teamId) {
      localStorage.setItem('currentTeamId', this.teamId);
      this.loadProjects();
      this.loadTeamDetails();
    }
  }

  loadTeamDetails() {
    this.projectsService.getTeamDetails(this.teamId).subscribe({
      next: (data: any) => this.teamDetails = data,
      error: () => console.error('Failed to load team details')
    });
  }

  loadProjects() {
    this.projectsService.getProjects(this.teamId).subscribe({
      next: (data: any) => {
        this.projects = data.filter((proj: any) => proj.team_id.toString() === this.teamId);
      },
      error: () => this.dialog.open(MessageDialogComponent, {
        data: { title: 'שגיאה', message: 'לא הצלחנו לטעון את הפרויקטים', isError: true }
      })
    });
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    this.projectsService.createProject({ name: this.newProjectName, teamId: this.teamId }).subscribe({
      next: (res: any) => {
        this.projects.push(res);
        this.newProjectName = '';
      },
      error: () => this.dialog.open(MessageDialogComponent, {
        data: { title: 'שגיאה', message: 'יצירת הפרויקט נכשלה', isError: true }
      })
    });
  }

  editProject(project: any) {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '400px',
      data: {
        title: 'עריכת שם פרויקט',
        label: 'שם הפרויקט החדש',
        initialValue: project.name
      }
    });

    dialogRef.afterClosed().subscribe(newName => {
      if (newName && newName !== project.name) {
        const id = project.id || project._id;
        this.projectsService.updateProject(id, { name: newName }).subscribe({
          next: (res: any) => project.name = res.name || newName,
          error: () => this.dialog.open(MessageDialogComponent, {
            data: { title: 'שגיאה', message: 'עדכון השם נכשל', isError: true }
          })
        });
      }
    });
  }
  deleteProject(project: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'מחיקת פרויקט',
        message: `האם למחוק את פרויקט "${project.name}"?`,
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const id = project.id || project._id;
        this.projectsService.deleteProject(id).subscribe({
          next: () => this.loadProjects(),
          error: () => this.dialog.open(MessageDialogComponent, {
            data: { title: 'שגיאה', message: 'המחיקה נכשלה', isError: true }
          })
        });
      }
    });
  }

  openProject(projectId: string) {
    localStorage.setItem('currentProjectId', projectId);
    this.router.navigate(['/projects', projectId, 'tasks']);
  }

  goBack() { this.router.navigate(['/teams']); }

  manageTeamMembers() {
    if (!this.teamDetails) return;
    const dialogRef = this.dialog.open(TeamMembersDialogComponent, {
      width: '500px',
      data: { teamId: this.teamId, teamName: this.teamDetails.name },
      panelClass: 'members-dialog'
    });
    dialogRef.afterClosed().subscribe(() => this.loadTeamDetails());
  }
}