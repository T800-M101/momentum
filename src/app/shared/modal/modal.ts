import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  title = input<string>('Unsaved changes');
  body = input<string>('You have a journal entry in progress. If you exit now, you will lose all the content you have written. Do you want to discard the changes?');
  btnCancelText = input<string>('Keep writing');
  btnConfirmText = input<string>('Discard and exit');
  mode = input<'warning' | 'danger'>('warning');

  onDecision = output<boolean>();

  makeDecision(allowNavigation: boolean) {
    this.onDecision.emit(allowNavigation);
  }

}
