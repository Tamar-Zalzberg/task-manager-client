import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- חובה לייבא את זה

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink], // <--- חובה להוסיף את זה כאן! אחרת הקישורים לא עובדים
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent {
}