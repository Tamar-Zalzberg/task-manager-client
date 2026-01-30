import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-team-members-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>ניהול גישה לצוות</h2>
      <button mat-icon-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content class="custom-scrollbar">
      <div class="team-header">
        <div class="team-avatar-large">{{ teamName.charAt(0) }}</div>
        <div class="team-details">
          <h3>{{ teamName }}</h3>
          <p>{{ members.length }} חברים בצוות</p>
        </div>
      </div>

      <div class="invite-section">
        <label>הוסף אנשים לצוות</label>
        <div class="invite-row">
          <mat-form-field appearance="outline" class="invite-input">
            <mat-select [(ngModel)]="selectedUserId" placeholder="בחר שם או אימייל...">
              <mat-option *ngFor="let user of allUsers" [value]="user.id">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div class="user-avatar-small" [style.background-color]="getColorForUser(user.name)">
                    {{ user.name.charAt(0) }}
                  </div>
                  <span>{{ user.name }}</span>
                  <small style="color: gray; margin-right: auto;">{{ user.email }}</small>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <button mat-flat-button color="primary" (click)="addMember()" [disabled]="!selectedUserId || isAdding" class="invite-btn">
            הזמן
          </button>
        </div>
        <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
      </div>

      <mat-divider></mat-divider>

      <div class="members-list-section">
        <label>חברי הצוות</label>
        <mat-list>
          <mat-list-item *ngFor="let member of members" class="member-row">
            <div matListItemAvatar class="user-avatar" [style.background-color]="getColorForUser(member.name)">
              {{ member.name.charAt(0) }}
            </div>
            <span matListItemTitle class="member-name">
              {{ member.name }} 
              <span *ngIf="member.role === 'owner'" class="badge owner">בעלים</span>
            </span>
            <span matListItemLine class="member-email">{{ member.email }}</span>
            
            <button mat-icon-button color="warn" (click)="openRemoveDialog(member.user_id)" matTooltip="הסר מהצוות">
              <mat-icon class="remove-icon">close</mat-icon>
            </button>
          </mat-list-item>
        </mat-list>
        
        <div *ngIf="members.length === 0" class="empty-members">
          אין עדיין חברים בצוות זה
        </div>
      </div>

    </mat-dialog-content>
  `,
  styles: [`
    /* סגנון כללי נקי */
    :host {
      display: block;
      direction: rtl;
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 24px 0;
    }
    h2 {
      font-family: 'Segoe UI', sans-serif;
      font-size: 20px;
      font-weight: 600;
      color: #292d34;
      margin: 0;
    }
    
    /* Header של הצוות */
    .team-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 25px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .team-avatar-large {
      width: 40px;
      height: 40px;
      background: #7b68ee; /* ClickUp Purple */
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
    .team-details h3 { margin: 0; font-size: 16px; font-weight: 600; }
    .team-details p { margin: 0; font-size: 12px; color: #7f7f7f; }

    /* אזור ההזמנה */
    .invite-section { margin-bottom: 20px; }
    .invite-section label, .members-list-section label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #7f7f7f;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .invite-row { display: flex; gap: 10px; }
    .invite-input { flex: 1; }
    .invite-btn { height: 50px; border-radius: 8px; background-color: #7b68ee; }
    
    /* רשימת חברים */
    .members-list-section { margin-top: 20px; }
    .user-avatar, .user-avatar-small {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      border-radius: 50%;
    }
    .user-avatar { width: 36px; height: 36px; font-size: 14px; }
    .user-avatar-small { width: 24px; height: 24px; font-size: 12px; border-radius: 4px; }
    
    .member-name { font-weight: 500; font-size: 14px; color: #292d34; }
    .member-email { font-size: 12px; color: #87909e; }
    
    .badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 5px;
    }
    .badge.owner { background-color: #fff0b3; color: #b38f00; }
    
    .remove-icon { font-size: 18px; color: #e0e0e0; transition: 0.2s; }
    .remove-icon:hover { color: #f55; }
    
    .error-msg { color: #f55; font-size: 12px; margin-top: 5px; }
    .empty-members { text-align: center; color: #aaa; padding: 20px; font-style: italic; }

    /* התאמות ל-Angular Material */
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      border-radius: 12px !important;
    }
  `]
})
export class TeamMembersDialogComponent implements OnInit {
  // ... הלוגיקה נשארת אותו דבר ...
  members: any[] = [];
  allUsers: any[] = [];
  teamName: string = '';
  teamId: string = '';
  selectedUserId: number | null = null;
  selectedRole: string = 'member';
  errorMessage: string = '';
  isAdding: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TeamMembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teamId: string; teamName: string },
    private teamsService: TeamsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.teamId = data.teamId;
    this.teamName = data.teamName;
  }

  ngOnInit() {
    this.loadTeamMembers();
    this.loadAllUsers();
  }

  // צבע אקראי לפי שם המשתמש
  getColorForUser(name: string): string {
    const colors = ['#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#FFC107', '#FF9800'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  loadAllUsers() {
    this.teamsService.getAllUsers().subscribe({
      next: (users: any[]) => { this.allUsers = users; },
      error: (err) => console.error(err)
    });
  }

  loadTeamMembers() {
    this.teamsService.getTeam(this.teamId).subscribe({
      next: (team: any) => { this.members = team.members || []; },
      error: (err) => console.error(err)
    });
  }

  addMember() {
    if (!this.selectedUserId) return;
    this.isAdding = true;
    this.teamsService.addMemberToTeam(this.teamId, String(this.selectedUserId), this.selectedRole).subscribe({
      next: () => {
        this.selectedUserId = null;
        this.isAdding = false;
        this.loadTeamMembers();
      },
      error: (err) => {
        this.isAdding = false;
        this.errorMessage = 'שגיאה בהוספה (אולי המשתמש כבר קיים?)';
      }
    });
  }

  openRemoveDialog(userId: number) {
      if(confirm('להסיר את המשתמש מהצוות?')) {
          this.removeMember(userId);
      }
  }

  removeMember(userId: number) {
    this.teamsService.removeMember(this.teamId, String(userId)).subscribe({
      next: () => this.loadTeamMembers(),
      error: (err) => alert('שגיאה במחיקה')
    });
  }
}