import { Component, computed, inject, input, signal } from '@angular/core';
import { JournalService } from '../../../core/services/journal/journal-service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-entry',
  imports: [ DatePipe, CommonModule ],
  templateUrl: './entry.html',
  styleUrl: './entry.css',
})
export class Entry {
  journalService = inject(JournalService);
  private router = inject(Router);
  showGallery = signal(false);
  id = input.required<string>();

  entry = computed(() => {
    const entryId = Number(this.id());
    const list = this.journalService.entries();

    if (list.length === 0) {
      this.journalService.loadEntries();
      return null;
    }

    return list.find(e => Number(e.id) === entryId);
  });

  navigateToEdit() {
    const currentEntry = this.entry();
    if (currentEntry && currentEntry.id) {
      this.router.navigate(['/new'], { queryParams: { id: currentEntry.id } });
    }
  }



}
