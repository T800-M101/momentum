import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading/loading.service';

@Component({
  selector: 'app-loading-overlay',
  imports: [],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.css',
})
export class LoadingOverlay {
  loadingService = inject(LoadingService);
}
