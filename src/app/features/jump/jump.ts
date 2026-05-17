import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatePicker } from '../../shared/date-picker/date-picker';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { IconsService } from '../../core/services/icons/icons-service';

@Component({
  selector: 'app-jump',
  imports: [CommonModule, DatePicker, CustomInput],
  templateUrl: './jump.html',
  styleUrl: './jump.css',
})
export class Jump {
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;
}
