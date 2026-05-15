import { Component, input } from '@angular/core';

@Component({
  selector: 'app-journal-card',
  imports: [],
  templateUrl: './journal-card.html',
  styleUrl: './journal-card.css',
})
export class JournalCard {
  day = input.required<number>();
  dayName = input<string>('Mon'); 
  title = input<string>('');
  time = input<string>('');
  content = input<string>('');
}
