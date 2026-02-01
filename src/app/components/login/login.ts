import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // שינינו ל-FormsModule
import { Router, RouterLink } from '@angular/router'; // הוספנו RouterLink
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // הורדנו את כל ה-Material Modules כדי שהעיצוב יהיה נקי וקל
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // משתנים פשוטים במקום FormBuilder
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // בדיקה בסיסית שהשדות מלאים
    if (!this.email || !this.password) {
      this.errorMessage = 'אנא מלא את כל השדות';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login successful');
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'שגיאה בהתחברות: בדוק את האימייל והסיסמה';
      }
    });
  }
}