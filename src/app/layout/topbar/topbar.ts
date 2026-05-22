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
    const urlTree = this.router.parseUrl(this.router.url);
    const primarySegments = urlTree.root.children['primary']?.segments;
    const currentPath = primarySegments ? primarySegments.map(s => s.path).join('/') : '';

    return currentPath === '' || currentPath === 'entries';
  });

 handleInstantFilter(query: string) {
  const cleanQuery = query?.trim();

  this.router.navigate([], {
    queryParams: { search: cleanQuery || null },
    queryParamsHandling: 'merge'
  });
}
}
