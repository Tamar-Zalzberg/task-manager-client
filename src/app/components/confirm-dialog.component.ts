  import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="direction: rtl; text-align: right;">מחיקת משימה</h2>
    <mat-dialog-content style="direction: rtl; text-align: right;">
      האם את בטוחה שאת רוצה למחוק את המשימה הזו?
      <br>
      <small style="color: gray;">פעולה זו לא ניתנת לביטול.</small>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="direction: rtl; gap: 10px; padding-bottom: 20px; padding-left: 20px;">
      <button mat-button mat-dialog-close>ביטול</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">כן, מחק</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}