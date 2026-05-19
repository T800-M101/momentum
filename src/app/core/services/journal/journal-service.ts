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
   * Envía una nueva entrada del diario a la API de NestJS
   * @param payload Objeto con la estructura { title, content, moodId, date, tags }
   * @returns Observable con la Entrada guardada e incluyendo sus relaciones de Postgres
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
        // Opcional: Aquí podrías actualizar un signal global de 'entries'
        // si tuvieras una lista activa en memoria para que se refleje sin recargar la página.
      })
    );
  }

}
