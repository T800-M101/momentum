import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatePicker } from '../../shared/date-picker/date-picker';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { IconsService } from '../../core/services/icons/icons-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-jump',
  imports: [CommonModule, DatePicker, CustomInput],
  templateUrl: './jump.html',
  styleUrl: './jump.css',
})
export class Jump {
  private router = inject(Router);
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();

    this.router.navigate(['/entries'], {
      queryParams: { search: query || null }, // If empty, remove the parameter from the URL
      queryParamsHandling: 'merge' // It retains the date filter if it already existed.
    });
  }
}
