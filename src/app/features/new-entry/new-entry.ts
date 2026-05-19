import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../core/services/icons/icons-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../core/services/journal/journal-service';
import { HasPendingChanges } from '../../core/guards/pending-changes/pending-changes-guard';
import { ExitModal } from '../../shared/exit-modal/exit-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-entry',
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule, ExitModal],
  templateUrl: './new-entry.html',
  styleUrl: './new-entry.css',
})
export class NewEntry implements OnInit, HasPendingChanges {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  private iconsService = inject(IconsService);
  private journalService = inject(JournalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private modalResolve: ((value: boolean) => void) | null = null;
  icons = this.iconsService.icons;
  moodContainer = viewChild<ElementRef>('moodSection');
  showMoodMenu = signal(false);
  selectedMood = signal<any>(null);
  showPhotoSection = signal(false);
  moods = this.journalService.moods;
  showExitModal = signal(false);
  now = signal(new Date());

  entryForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', Validators.required],
    moodId: [null, Validators.required],
    tags: [''],
    date: [new Date(), Validators.required],
  });

  constructor() {
    this.journalService.loadMoods();
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.entryForm.dirty) {
      return true;
    }
    this.showExitModal.set(true);

    return new Promise<boolean>((resolve) => {
      this.modalResolve = resolve;
    });
  }

  handleModalDecision(allowNavigation: boolean) {
    this.showExitModal.set(false);

    if (this.modalResolve) {
      this.modalResolve(allowNavigation);
      this.modalResolve = null;
    }
  }

  ngOnInit(): void {
    this.entryForm.patchValue({ date: this.now() });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.entryForm.dirty) {
      $event.returnValue = true;
    }
  }

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
    this.entryForm.patchValue({ moodId: mood.id });
    this.showMoodMenu.set(false);
  }

  saveEntry() {
    if (this.entryForm.valid) {
      const rawTags = this.entryForm.value.tags as string;
      const processedTags = rawTags
        ? rawTags
            .split(' ')
            .map((tag) => tag.replace(/#/g, '').trim())
            .filter((tag) => tag.length > 0)
        : [];

      const payload = {
        title: this.entryForm.value.title,
        content: this.entryForm.value.content,
        moodId: Number(this.entryForm.value.moodId),
        date: this.entryForm.value.date,
        tags: processedTags,
      };

      console.log('Enviando a NestJS:', payload);

      this.journalService.createEntry(payload).subscribe({
        next: (response) => {
          console.log('Entrada guardada con éxito en Postgres:', response);
          this.entryForm.reset();
          this.router.navigate(['/entries']);
        },
        error: (err) => {
          console.error('Error al intentar guardar la entrada:', err);
          // Aquí podrías setear un signal de error para mostrar un banner en la UI si falla Docker/Postgres
        }
      });
    } else {
      this.entryForm.markAllAsTouched();
    }
  }

}
