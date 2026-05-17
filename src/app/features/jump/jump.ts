import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatePicker } from '../pages/date-picker/date-picker';
import { LucideAngularModule } from 'lucide-angular';
import { Search } from 'lucide-angular';
import { CustomInput } from '../../shared/custom-input/custom-input';

@Component({
  selector: 'app-jump',
  imports: [CommonModule, DatePicker, LucideAngularModule, CustomInput],
  templateUrl: './jump.html',
  styleUrl: './jump.css',
})
export class Jump {

  readonly icons = { Search };

}
