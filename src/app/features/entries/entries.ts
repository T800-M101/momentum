import { Component, inject } from '@angular/core';
import { JournalCard } from '../pages/journal-card/journal-card';
import { JournalService } from '../../core/services/journal/journal-service';

@Component({
  selector: 'app-entries',
  imports: [JournalCard],
  templateUrl: './entries.html',
  styleUrl: './entries.css',
})
export class Entries {
  journalService = inject(JournalService);
  entries = this.journalService.entries;
}
