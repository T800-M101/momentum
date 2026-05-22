import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatePicker } from '../../shared/date-picker/date-picker';
import { IconsService } from '../../core/services/icons/icons-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-jump',
  imports: [CommonModule, DatePicker],
  templateUrl: './jump.html',
  styleUrl: './jump.css',
})
export class Jump {
  private router = inject(Router);
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  handleSearch(query: string) {
  const cleanQuery = query?.trim();

  this.router.navigate(['/entries'], {
    queryParams: { search: cleanQuery || null },
    queryParamsHandling: 'merge'
  });
}
}
