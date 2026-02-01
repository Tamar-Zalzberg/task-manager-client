import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // חובה כדי שהכפתורים יעבדו

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink], 
  // שימי לב: אם שמות הקבצים שלך הם about.html ו-about.css תשאiriי ככה.
  // אם הם עדיין about.component.html (הארוך), תוסיפי את המילה component באמצע.
  templateUrl: './about.html', 
  styleUrl: './about.css'
})
export class AboutComponent {

}