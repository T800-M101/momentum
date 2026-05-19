import { Component, inject, OnInit } from '@angular/core';
import { JournalService } from '../../core/services/journal/journal-service';
import { JournalCard } from '../../shared/journal/journal-card/journal-card';

@Component({
  selector: 'app-entries',
  imports: [JournalCard],
  templateUrl: './entries.html',
  styleUrl: './entries.css',
})
export class Entries implements OnInit {
  journalService = inject(JournalService);
  entries = this.journalService.entries;

  ngOnInit() {
    this.journalService.loadEntries();
  }
}
