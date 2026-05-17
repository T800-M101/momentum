import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Search } from 'lucide-angular';
import { CustomInput } from '../../shared/custom-input/custom-input';

@Component({
  selector: 'app-topbar',
  imports: [LucideAngularModule, CustomInput],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private router = inject(Router);

  readonly icons = {
   Search
  };

  showSearch = computed(() => {
    this.router.currentNavigation();

    return [
      '/',
      '/entries',
    ].includes(this.router.url);
  });

}
