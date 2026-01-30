import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamsService } from '../../services/teams.service';
import { TeamMembersDialogComponent } from '../team-members-dialog.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    TeamMembersDialogComponent
  ],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  teamForm: FormGroup;

  constructor(
    private teamsService: TeamsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (res) => {
        this.teams = res;
      },
      error: (err) => console.error('Error loading teams:', err)
    });
  }

  createTeam() {
    if (this.teamForm.valid) {
      this.teamsService.createTeam(this.teamForm.value).subscribe({
        next: () => {
          this.loadTeams();
          this.teamForm.reset();
          this.snackBar.open('הצוות נוצר בהצלחה!', 'סגור', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error creating team:', err);
          this.snackBar.open('שגיאה ביצירת הצוות', 'סגור', { duration: 3000 });
        }
      });
    }
  }

  deleteTeam(event: Event, teamId: string) {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDeleteTeamDialogComponent, {
      width: '400px',
      disableClose: false,
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.teamsService.deleteTeam(teamId).subscribe({
          next: () => {
            this.snackBar.open('הצוות נמחק בהצלחה', 'סגור', { duration: 3000 });
            this.loadTeams();
          },
          error: (err) => {
            console.error('Error deleting team:', err);
            let msg = 'שגיאה במחיקת הצוות';
            if (err.status === 403) msg = 'רק בעלים יכולים למחוק צוות';
            this.snackBar.open(msg, 'סגור', { duration: 5000 });
          }
        });
      }
    });
  }

  openMembersDialog(event: Event, teamId: string, teamName: string) {
    event.stopPropagation();
    
    this.dialog.open(TeamMembersDialogComponent, {
      width: '500px',
      data: { teamId, teamName },
      disableClose: false,
      panelClass: 'members-dialog'
    });
  }
}

// --- הקומפוננטה המתוקנת ---
@Component({
  selector: 'app-confirm-delete-team-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>אישור מחיקת צוות</h2>
    <mat-dialog-content>
      <p>האם אתה בטוח שברצונך למחוק את הצוות הזה?</p>
      <p style="color: #d32f2f; font-weight: bold;">כל הנתונים בצוות זה יימחקו.</p>
      <p style="color: #d32f2f; font-size: 12px;">פעולה זו לא ניתנת לביטול.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">ביטול</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">
        <mat-icon>delete</mat-icon>
        מחק צוות
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions {
      gap: 8px;
    }
  `]
})
export class ConfirmDeleteTeamDialogComponent {
  // התיקון כאן: הוספנו @Inject(MatDialogRef)
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ConfirmDeleteTeamDialogComponent>
  ) {}
}