import { Injectable, signal } from '@angular/core';
import { JournalEntry, MoodOption } from '../../interfaces/journal-entry.interface';



@Injectable({
  providedIn: 'root'
})
export class JournalService {

  readonly MOOD_OPTIONS: MoodOption[] = [
    { value: 'happy', emoji: '✨', label: 'Feliz', color: '#FACC15' },
    { value: 'productive', emoji: '💪', label: 'Productivo', color: '#34D399' },
    { value: 'neutral', emoji: '😶', label: 'Neutral', color: '#9CA3AF' },
    { value: 'sad', emoji: '☁️', label: 'Triste', color: '#60A5FA' },
    { value: 'embarrassed', emoji: '😳', label: 'Apenado', color: '#FB7185' },
    { value: 'angry', emoji: '🔥', label: 'Enojado', color: '#EF4444' },
    { value: 'hungry', emoji: '🍱', label: 'Hambriento', color: '#F59E0B' },
    { value: 'tired', emoji: '💤', label: 'Cansado', color: '#8B5CF6' }
  ];

private initialData: JournalEntry[] = [
    {
      id: '1', day: 16, dayName: 'SAT',
      title: 'Mañana de caminata por Chipinque',
      content: 'El clima en Monterrey hoy estuvo espectacular. Logré subir hasta el mirador antes de que empezara el calor fuerte. El clima en Monterrey hoy estuvo espectacular. Logré subir hasta el mirador antes de que empezara el calor fuerte. El clima en Monterrey hoy estuvo espectacular. Logré subir hasta el mirador antes de que empezara el calor fuerte.',
      time: '08:30 AM', mood: 'productive',
      mediaCount: 4,
    },
    {
      id: '2', day: 17, dayName: 'SUN',
      title: 'Angular Signals',
      content: 'Implementé el Theme Service. La arquitectura se siente mucho más sólida y reactiva.',
      time: '11:20 PM', mood: 'happy',
      mediaCount: 1
    },
    {
      id: '3', day: 18, dayName: 'MON',
      title: 'Planos del escritorio',
      content: 'Revisando perfiles de acero para el soporte de los monitores. Casi listo.',
      time: '04:15 PM', mood: 'neutral',
      mediaCount: 0
    },
    {
      id: '4', day: 19, dayName: 'TUE',
      title: 'Día complicado con el deploy',
      content: 'Problemas con certificados SSL. Mañana será un mejor día para el despliegue.',
      time: '09:00 PM', mood: 'sad',
      mediaCount: 0
    }
  ];

  entries = signal<JournalEntry[]>(this.initialData);

  constructor() {}

  addEntry(entry: JournalEntry) {
    this.entries.update(prev => [entry, ...prev]);
  }

  getMoodData(value: string): MoodOption | undefined {
    return this.MOOD_OPTIONS.find(m => m.value === value);
  }
}
