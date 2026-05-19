import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastrService } from '../../core/services/toastr/toastr-service';

@Component({
  selector: 'app-toastr',
  imports: [CommonModule],
  template: `
    @if (toastService.currentToast(); as toast) {
      <div class="toast-card" [ngClass]="toast.type">
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
        </span>
        <p class="toast-message">{{ toast.message }}</p>
      </div>
    }
  `,
  styleUrl: './toastr.css',
})
export class Toastr {
  toastService = inject(ToastrService);
}
