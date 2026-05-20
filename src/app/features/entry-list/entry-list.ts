import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JournalService } from '../../core/services/journal/journal-service';
import { JournalCard } from '../../shared/journal/journal-card/journal-card';
import { IconsService } from '../../core/services/icons/icons-service';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry-list',
  imports: [JournalCard, LucideAngularModule],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.css',
})
export class EntryList implements OnInit {
  private route = inject(ActivatedRoute);
  journalService = inject(JournalService);
  entries = this.journalService.entries;

  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  currentFilterDate = signal<string | null>(null);
  currentFilterSearch = signal<string | null>(null);
  isFilteredView = computed(() => this.currentFilterDate() !== null || this.currentFilterSearch() !== null);

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
    this.route.queryParams.subscribe(params => {
    const dateFilter = params['date'] || null;
    const searchFilter = params['search'] || null;

    // We've updated the reactive states for UI messages
    this.currentFilterDate.set(dateFilter);
    this.currentFilterSearch.set(searchFilter);

    // We sent both filters to the service (the service will know what to do)
    this.journalService.loadEntries({ date: dateFilter, search: searchFilter });
  });
}
}
