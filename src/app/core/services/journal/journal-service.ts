import { inject, Injectable, signal } from '@angular/core';
import { JournalEntry } from '../../interfaces/journal-entry.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/journal';

  private entriesSignal = signal<JournalEntry[]>([]);
  readonly entries = this.entriesSignal.asReadonly();

  async loadEntries() {
    try {
      const data = await firstValueFrom(
        this.http.get<JournalEntry[]>(this.apiUrl)
      );
      this.entriesSignal.set(data);
    } catch (error) {
      console.error('Failed to load entries from Monterrey DB:', error);
    }
  }

  constructor() {}

  // addEntry(entry: JournalEntry) {
  //   this.entries.update(prev => [entry, ...prev]);
  // }


}
