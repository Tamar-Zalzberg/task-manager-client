import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../../services/teams.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit {

  teams: any[] = [];

  newTeamName: string = '';
  errorMessage: string = '';

  constructor(private teamsService: TeamsService, private router: Router) { }

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        console.log('Teams loaded:', this.teams);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'לא הצלחנו לטעון את הצוותים.';
      }
    });
  }

  createTeam() {
    if (!this.newTeamName.trim()) return;

    const newTeam = { name: this.newTeamName };

    this.teamsService.createTeam(newTeam).subscribe({
      next: (res) => {
        console.log('Team created:', res);
        this.newTeamName = '';
        this.loadTeams();
      },
      error: (err) => {
        console.error(err);
        alert('שגיאה ביצירת הצוות');
      }
    });
  }

  openTeam(teamId: string) {
    this.router.navigate(['/teams', teamId, 'projects']);
  }

  addMember(event: Event, teamId: string) {
    event.stopPropagation();

    const userIdStr = prompt('הכנס את מזהה המשתמש (user ID - מספר):');

    if (userIdStr && userIdStr.trim()) {
      const userId = userIdStr.trim();

      if (isNaN(Number(userId))) {
        alert('User ID חייב להיות מספר!');
        return;
      }

      this.teamsService.addMemberToTeam(teamId, userId).subscribe({
        next: () => {
          alert('המשתמש נוסף בהצלחה!');
          this.loadTeams();
        },
        error: (err) => {
          console.error('Error adding member:', err);
          console.error('Status:', err.status);
          console.error('Error response:', err.error);

          let errorMsg = 'שגיאה בהוספת המשתמש';

          if (err.status === 400) {
            errorMsg = 'User ID חסר או לא תקין - וודא שהכנסת מספר';
          } else if (err.status === 403) {
            errorMsg = 'אתה לא חבר בצוות זה או אין הרשאה';
          } else if (err.status === 404) {
            errorMsg = 'המשתמש או הצוות לא קיימים';
          } else if (err.status === 0) {
            errorMsg = 'שגיאה בחיבור לשרת';
          }

          alert(errorMsg);
        }
      });
    }
  }

  deleteTeam(event: Event, teamId: string) {
    event.stopPropagation();
    if (confirm('למחוק את הפרויקט הזה?')) {
      this.teamsService.deleteTeam(teamId).subscribe({
        next: () => this.loadTeams(),
        error: (err) => alert('שגיאה במחיקה')
      });
    }
  }
}