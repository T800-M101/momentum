import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatePicker } from '../pages/date-picker/date-picker';

@Component({
  selector: 'app-jump',
  imports: [CommonModule, DatePicker],
  templateUrl: './jump.html',
  styleUrl: './jump.css',
})
export class Jump {

}
