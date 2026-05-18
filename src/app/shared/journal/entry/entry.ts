import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry',
  imports: [],
  templateUrl: './entry.html',
  styleUrl: './entry.css',
})
export class Entry {

  private route = inject(ActivatedRoute);

  entry = signal<any>({
    id: 16,
    title: 'Mañana de caminata por Chipinque',
    mood: '💪',
    date: 'Saturday, Jan 16',
    content: `
      <p>El clima en Monterrey hoy estuvo espectacular.</p>
      <p>Logré subir hasta el mirador antes de que empezara el calor fuerte.</p>
    `
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Entry ID:', id);

    // later:
    // fetch entry by id
  }

}
