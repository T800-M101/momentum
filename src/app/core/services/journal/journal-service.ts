import { inject, Injectable, signal } from '@angular/core';
import { JournalEntry, Mood } from '../../interfaces/journal-entry.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private http = inject(HttpClient);

  // Centrally configured endpoints
  private apiUrl = 'http://localhost:3000/';
  private journalUrl = `${this.apiUrl}journal`;
  private moodUrl = `${this.apiUrl}mood`;

  // 1. Internal State Management with Reactive Signals
  private entriesSignal = signal<JournalEntry[]>([]);
  private moodSignal = signal<Mood[]>([]);

  // 2. Display of Read-Only Status for Standalone Components
  readonly entries = this.entriesSignal.asReadonly();
  readonly moods = this.moodSignal.asReadonly();

  constructor() {}

  /**
   * Fetch journal entries from Postgres via NestJS and update the global entries Signal.
   * Supports dynamic filtering by a specific calendar date and/or search keywords.
   * * @param filters Optional object containing active query constraints
   * @param filters.date Optional ISO date string (YYYY-MM-DD) to fetch a single day
   * @param filters.search Optional text query or tag (e.g., '#travel') to filter records
   */
  async loadEntries(filters?: { date: string | null; search: string | null }): Promise<void> {
    try {
      const params = new URLSearchParams();

      // We force it to only be added if it has real text and is not an empty string
      if (filters?.date && filters.date.trim() !== '') {
        params.append('date', filters.date);
      }

      if (filters?.search && filters.search.trim() !== '') {
        params.append('search', filters.search.trim());
      }

      const queryString = params.toString();
      const url = queryString ? `${this.journalUrl}?${queryString}` : this.journalUrl;

      const data = await firstValueFrom(this.http.get<JournalEntry[]>(url));
      this.entriesSignal.set(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }

  /**
   * Fetch all available moods from the DB to populate selection forms.
   */
  async loadMoods(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Mood[]>(this.moodUrl));
      this.moodSignal.set(data);
    } catch (error) {
      console.error('Failed to load moods from Journal DB:', error);
    }
  }

  /**
   * Send a new journal entry to the NestJS API and prepend it to the local Signal state.
   * @param payload Object with the structure { title, content, moodId, date, tags }
   * @returns Observable with the saved entry including its Postgres relationships
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
        // Reactividad optimista: se inserta la nueva nota arriba del listado de inmediato
        this.entriesSignal.update((entries) => [newEntry, ...entries]);
      }),
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
   * Update an existing journal entry on the NestJS API and replace it in the state.
   * @param id The database primary key ID of the journal entry to modify
   * @param payload Object containing the fields to update (title, content, moodId, tags)
   * @returns Observable with the updated entry data from the database
   */
  updateEntry(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.journalUrl}/${id}`, payload).pipe(
      tap((updatedEntry) => {
        // Buscamos y reemplazamos el registro viejo con la data fresca en el Signal
        this.entriesSignal.update((entries) =>
          entries.map((e) => (e.id === id ? updatedEntry : e)),
        );
      }),
    );
  }

  /**
   * Remove a specific journal entry from the NestJS API and clear it out from local state.
   * @param id The database primary key ID of the journal entry to delete
   * @returns Observable confirming the deletion status from Postgres
   */
  deleteEntry(id: number): Observable<any> {
    return this.http.delete<any>(`${this.journalUrl}/${id}`).pipe(
      tap(() => {
        // Remueve la entrada borrada del Signal reactivo al instante para actualizar la UI
        this.entriesSignal.update((entries) => entries.filter((e) => e.id !== id));
      }),
    );
  }

  /**
   * Backward-compatible alias for loadEntries to safely fulfill previous invocation mappings.
   */
  refreshEntries(): void {
    this.loadEntries();
  }
}
