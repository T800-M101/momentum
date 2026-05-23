import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private pendingRequests = signal(0);

  readonly isLoading = this.pendingRequests.asReadonly();

  show() {
    this.pendingRequests.update(v => v + 1);
  }

  hide() {
    this.pendingRequests.update(v => Math.max(0, v - 1));
  }

  reset() {
    this.pendingRequests.set(0);
  }
}
