import { Component, computed, inject, OnInit } from '@angular/core';
import { JournalService } from '../../core/services/journal/journal-service';
import { JournalCard } from '../../shared/journal/journal-card/journal-card';
import { IconsService } from '../../core/services/icons/icons-service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-entry-list',
  imports: [JournalCard, LucideAngularModule],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.css',
})
export class EntryList implements OnInit {
  journalService = inject(JournalService);
  entries = this.journalService.entries;

  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  groupedEntries = computed(() => {
    const entries = this.journalService.entries();
    const groups: { [key: string]: any[] } = {};

    entries.forEach(entry => {
      const entryDate = new Date(entry.date);

      const monthYear = entryDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(entry);
    });

    return Object.keys(groups).map(key => ({
      monthYear: key,
      entries: groups[key]
    }));
  });

  ngOnInit() {
    this.journalService.loadEntries();
  }
}
