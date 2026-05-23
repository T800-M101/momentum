import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toastr } from './shared/toastr/toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toastr ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('momentum');
}
