import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { IconsService } from '../../core/services/icons/icons-service';

@Component({
  selector: 'app-topbar',
  imports: [ CustomInput ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private router = inject(Router);
  private iconsService = inject(IconsService);

  icons = this.iconsService.icons;
  
  showSearch = computed(() => {
    this.router.currentNavigation();

    return [
      '/',
      '/entries',
    ].includes(this.router.url);
  });

}
