import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // בשביל דברים בסיסיים של אנגולר
import { RouterLink } from '@angular/router';   // <--- זה הכי חשוב! בשביל שהכפתורים יעבדו

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css' 
})
export class LandingPageComponent {
}