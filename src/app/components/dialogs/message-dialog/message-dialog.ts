import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './message-dialog.html',
  styleUrls: ['./message-dialog.css']
})
export class MessageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; isError?: boolean }) {}
}