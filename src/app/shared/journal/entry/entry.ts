import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalEntry } from '../../../core/interfaces/journal-entry.interface';

@Component({
  selector: 'app-entry',
  imports: [],
  templateUrl: './entry.html',
  styleUrl: './entry.css',
})
export class Entry {

  private route = inject(ActivatedRoute);
  showGallery = signal(false);

  entry = signal<JournalEntry>({
    id: 16,
    title: 'Mañana de caminata por Chipinque',
    mood: 'happy',
    date: 'Saturday, Jan 16',
    content: `
      <p>El clima en Monterrey hoy estuvo espectacular.</p>
      <p>Logré subir hasta el mirador antes de que empezara el calor fuerte.</p>
    `,

    images: [
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      alt: 'Mountain peaks'
    },
    {
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
      alt: 'Morning landscape'
    },
    {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
      alt: 'Forest path'
    },
    {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      alt: 'Mist over the hills'
    }
  ]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Entry ID:', id);
  }


}
