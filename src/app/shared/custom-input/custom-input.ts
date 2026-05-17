import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search } from 'lucide-angular';

@Component({
  selector: 'app-custom-input',
  imports: [LucideAngularModule],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput {

  placeholder = input<string>('Search...');
  icon = input<any>(Search);
  value = input<string>('');

  valueChange = output<string>();

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.valueChange.emit(val);
  }

}
