import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search } from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  imports: [LucideAngularModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

  readonly icons = {
   Search
  };

}
