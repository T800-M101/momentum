import { Component, inject, OnInit } from '@angular/core';
import { JournalService } from '../../core/services/journal/journal-service';
import { JournalCard } from '../../shared/journal/journal-card/journal-card';

@Component({
  selector: 'app-entry-list',
  imports: [JournalCard],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.css',
})
export class EntryList implements OnInit {
  journalService = inject(JournalService);
  entries = this.journalService.entries;

  ngOnInit() {
    this.journalService.loadEntries();
  }
}
