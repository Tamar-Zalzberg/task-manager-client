import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // חובה בשביל שהכפתורים יעבדו

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent {
}