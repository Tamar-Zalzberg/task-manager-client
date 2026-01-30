import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, limit: number = 20): string {
    // אם אין טקסט, תחזיר ריק
    if (!value) return '';
    
    // אם הטקסט קצר מהגבול, תחזיר אותו כמו שהוא
    if (value.length <= limit) return value;

    // אחרת: תחתוך את הטקסט ותוסיף 3 נקודות
    return value.substr(0, limit) + '...';
  }

}