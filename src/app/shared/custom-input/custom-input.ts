import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-custom-input',
  imports: [LucideAngularModule],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput {

  placeholder = input<string>('Search...');
  icon = input<any>();
  value = input<string>('');
  valueChange = output<string>();
  enterPressed = output<string>();

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.valueChange.emit(val);
  }

  onSearchTriggered() {
    this.enterPressed.emit(this.value());
  }

}
