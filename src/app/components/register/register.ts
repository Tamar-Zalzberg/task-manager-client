import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- שימי לב: FormsModule
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,     // לטפסים פשוטים
    RouterLink       // לקישורים
  ], 
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // בדיקה שכל השדות מלאים
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'אנא מלא את כל השדות';
      return;
    }

    const userToSend = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(userToSend).subscribe({
      next: (res) => {
        console.log('Registration successful');
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        console.error(err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'שגיאה בהרשמה. נסה שנית.';
        }
      }
    });
  }
}