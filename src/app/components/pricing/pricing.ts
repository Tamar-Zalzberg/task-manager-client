import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // חובה לניווט

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class PricingComponent {
}