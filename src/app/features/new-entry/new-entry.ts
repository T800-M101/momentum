import { Component, ElementRef, HostListener, inject, signal, ViewChild, viewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../core/services/icons/icons-service';

@Component({
  selector: 'app-new-entry',
  imports: [LucideAngularModule],
  templateUrl: './new-entry.html',
  styleUrl: './new-entry.css',
})
export class NewEntry {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;
  moodContainer = viewChild<ElementRef>('moodSection');
  showMoodMenu = signal(false);
  selectedMood = signal<any>(null);
  showPhotoSection = signal(false);
  moods = signal([
    { id: 1, emoji: '😀', label: 'Happy' },
    { id: 2, emoji: '😌', label: 'Calm' },
    { id: 3, emoji: '😴', label: 'Tired' },
    { id: 4, emoji: '😔', label: 'Sad' },
    { id: 5, emoji: '🤩', label: 'Excited' },
    { id: 6, emoji: '🥲', label: 'Emotional' },
  ]);

 @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const container = this.moodContainer()?.nativeElement;
    const path = event.composedPath();

    if (this.showMoodMenu() && container && !path.includes(container)) {
      this.showMoodMenu.set(false);
    }
  }

  toggleMoodMenu(event: Event) {
    event.stopPropagation();
    this.showMoodMenu.update((v) => !v);
  }

  selectMood(mood: any) {
    this.selectedMood.set(mood);
    this.showMoodMenu.set(false);
  }
format(command: string, value?: string) {
  const editor = this.editor.nativeElement;

  // keep focus inside editor
  editor.focus();

  switch (command) {
    case 'bold':
      document.execCommand('bold');
      break;

    case 'italic':
      document.execCommand('italic');
      break;

    case 'blockquote':
      document.execCommand('formatBlock', false, 'blockquote');
      break;

    case 'bulletList':
      document.execCommand('insertUnorderedList');
      break;

    default:
      document.execCommand(command, false, value);
  }
}

getContent() {
  return this.editor.nativeElement.innerHTML;
}
}
