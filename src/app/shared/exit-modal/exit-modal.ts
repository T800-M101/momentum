import { Component, output } from '@angular/core';

@Component({
  selector: 'app-exit-modal',
  imports: [],
  templateUrl: './exit-modal.html',
  styleUrl: './exit-modal.css',
})
export class ExitModal {

  onDecision = output<boolean>();

  makeDecision(allowNavigation: boolean) {
    this.onDecision.emit(allowNavigation);
  }

}
