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
import { JournalEntry } from '../../../core/interfaces/journal-entry.interface';
import { JournalService } from '../../../core/services/journal-service';

@Component({
  selector: 'app-journal-card',
  imports: [LucideAngularModule],
  templateUrl: './journal-card.html',
  styleUrl: './journal-card.css',
})
export class JournalCard {
  private journalService = inject(JournalService);
  private elementRef = inject(ElementRef);
  showMenu = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showMenu()) {
      this.showMenu.set(false);
    }
  }

  entry = input.required<JournalEntry>();
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

  moodInfo = computed(() => this.journalService.getMoodData(this.entry().mood));
}
