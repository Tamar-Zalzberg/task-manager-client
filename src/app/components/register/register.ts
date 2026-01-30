import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html', // שימי לב: זה השם הקצר לפי המחשב שלך
  styleUrl: './register.css'      // שימי לב: זה השם הקצר לפי המחשב שלך
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // יצירת אובייקט חדש שמתאים למה שהשרת מצפה לקבל
      const userToSend = {
        name: this.registerForm.value.username, // המרת username ל-name
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(userToSend).subscribe({
        next: (res) => {
          console.log('Registration successful');
          // כאן היתה הבעיה קודם - הוא ניסה ללכת לצוותים והמסך לא היה קיים
          this.router.navigate(['/teams']); 
        },
        error: (err) => {
          console.error(err);
          // בדיקה מה השגיאה האמיתית
          if (err.error && err.error.message) {
             this.errorMessage = err.error.message;
          } else {
             this.errorMessage = 'שגיאה בהרשמה. ייתכן והאימייל תפוס או שהפרטים שגויים.';
          }
        }
      });
    }
  }
}