import { inject, Injectable, signal } from '@angular/core';
import { JournalEntry, Mood } from '../../interfaces/journal-entry.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/';
  private journalUrl = `${this.apiUrl}journal`;
  private moodUrl = `${this.apiUrl}mood`;

  private entriesSignal = signal<JournalEntry[]>([]);
  readonly entries = this.entriesSignal.asReadonly();

  private moodSignal = signal<Mood[]>([]);
  readonly moods = this.moodSignal.asReadonly();

  async loadEntries() {
    try {
      const data = await firstValueFrom(
        this.http.get<JournalEntry[]>(this.journalUrl)
      );
      this.entriesSignal.set(data);
    } catch (error) {
      console.error('Failed to load entries from Journal DB:', error);
    }
  }

    async loadMoods() {
    try {
      const data = await firstValueFrom(
        this.http.get<Mood[]>(this.moodUrl)
      );
      this.moodSignal.set(data);
    } catch (error) {
      console.error('Failed to load moods from Journal DB:', error);
    }
  }

  constructor() {}

  // addEntry(entry: JournalEntry) {
  //   this.entries.update(prev => [entry, ...prev]);
  // }


}
