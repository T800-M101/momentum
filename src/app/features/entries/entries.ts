import { Component, inject } from '@angular/core';
import { JournalService } from '../../core/services/journal/journal-service';
import { JournalCard } from '../../shared/journal/journal-card/journal-card';

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
