import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() {
  }

  getRandomColors(count: number = 1): string[] {
    count = count > 0 ? count : 1;
    const letters = '0123456789ABCDEF';
    let color = '#';
    const res: string[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      res.push(color);
      color = '#';
    }
    return res;
  }
}
