import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Images, Ellipsis, Pencil, Trash2, ImagePlus, EllipsisVertical } from 'lucide-angular';
import { JournalService } from '../../../core/services/journal/journal-service';
import { JournalEntry } from '../../../core/interfaces/journal-entry.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-card',
  imports: [LucideAngularModule],
  templateUrl: './journal-card.html',
  styleUrl: './journal-card.css',
})
export class JournalCard {
  private journalService = inject(JournalService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  showMenu = signal(false);
  moodInfo = computed(() => this.journalService.getMoodData(this.entry().mood));
  entry = input.required<JournalEntry>();
  showMediaCount = signal(false);

  dateDetails = computed(() => {
    const dateValue = new Date(this.entry().date);
    return {
      day: dateValue.getDate(), // Ejemplo: 18
      dayName: dateValue.toLocaleDateString('en-US', { weekday: 'short' }), // Ejemplo: Mon
      time: this.entry().time || dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  });

  mediaCount = computed(() => this.entry().images?.length || 0);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showMenu()) {
      this.showMenu.set(false);
    }
  }

  readonly icons = {
    Images,
    Ellipsis,
    Pencil,
    Trash2,
    ImagePlus,
    EllipsisVertical,
  };

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu.update((v) => !v);
  }

  openEntry() {
    this.router.navigate(['/entry', this.entry().id]);
  }
}
