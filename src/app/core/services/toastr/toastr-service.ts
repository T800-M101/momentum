import { Injectable, signal } from "@angular/core";

export interface ToastrData {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  currentToast = signal<ToastrData | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.currentToast.set({ message, type });

    setTimeout(() => {
      this.currentToast.set(null);
    }, 3000);
  }
}
