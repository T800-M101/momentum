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
import { JournalEntry } from '../../../core/interfaces/journal-entry.interface';
import { Router } from '@angular/router';
import { IconsService } from '../../../core/services/icons/icons-service';

@Component({
  selector: 'app-journal-card',
  imports: [LucideAngularModule],
  templateUrl: './journal-card.html',
  styleUrl: './journal-card.css',
})
export class JournalCard {

  private router = inject(Router);
  private elementRef = inject(ElementRef);

  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  showMenu = signal(false);
  entry = input.required<JournalEntry>();
  dateDetails = computed(() => {
    const dateValue = new Date(this.entry().date);

    return {
      day: dateValue.getDate(),
      dayName: dateValue.toLocaleDateString('en-US', { weekday: 'short' }),
      time: dateValue.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  });

  showMediaCount = signal(false);
  mediaCount = computed(() => this.entry().images?.length || 0);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showMenu()) {
      this.showMenu.set(false);
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu.update((v) => !v);
  }

  openEntry() {
    this.router.navigate(['/entry', this.entry().id]);
  }

  editEntry(event: Event) {
    event.stopPropagation();
    this.showMenu.set(false);
    this.router.navigate(['/new'], { queryParams: { id: this.entry().id } });
  }

  // removeEntry(event: Event) {
  //   event.stopPropagation();
  //   this.showMenu.set(false);

  //   const confirmDelete = confirm('Are you sure you want to delete this entry? This action cannot be undone.');

  //   if (confirmDelete) {
  //     this.journalService.deleteEntry(this.entry().id).subscribe({
  //       next: () => {
  //         this.toastr.show('Entry deleted successfully', 'success');
  //         this.journalService.refreshEntries();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.toastr.show('Could not delete the entry. Please try again.', 'error');
  //       }
  //     });
  //   }
  // }
}
