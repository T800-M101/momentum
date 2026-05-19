import { inject, Injectable, signal } from '@angular/core';
import { JournalEntry, Mood } from '../../interfaces/journal-entry.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';



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

  /**
   * Send a new journal entry to the NestJS API
   * @param payload Object with the structure { title, content, moodId, date, tags }
   * @returns Observable with the saved entry and including its Postgres relationships
   */
  createEntry(payload: {
    title: string;
    content: string;
    moodId: number;
    date: Date | string;
    tags: string[];
  }): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.journalUrl, payload).pipe(
      tap((newEntry) => {
        console.log('Entry successfully created on the server:', newEntry);
      })
    );
  }

/**
   * Retrieve a specific journal entry by its unique identifier
   * @param id The database primary key ID of the journal entry
   * @returns Observable with the detailed entry object including its related mood and tags
   */
  getEntryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.journalUrl}/${id}`);
  }

  /**
   * Update an existing journal entry on the NestJS API
   * @param id The database primary key ID of the journal entry to modify
   * @param payload Object containing the fields to update (title, content, moodId, tags)
   * @returns Observable with the updated entry data from the database
   */
  updateEntry(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.journalUrl}/${id}`, payload);
  }

}
