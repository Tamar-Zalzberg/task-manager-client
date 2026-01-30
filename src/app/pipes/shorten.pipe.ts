import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, limit: number = 20): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substr(0, limit) + '...';
  }

}