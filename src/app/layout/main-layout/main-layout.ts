import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Sidebar} from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { MobileNav } from "../mobile-nav/mobile-nav";
import { JournalService } from '../../core/services/journal/journal-service';
import { Toastr } from '../../shared/toastr/toastr';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterOutlet, Sidebar, Topbar, MobileNav, Toastr],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  journalService = inject(JournalService);
  entries = this.journalService.entries;

}
