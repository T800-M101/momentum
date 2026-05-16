import { Component, inject } from '@angular/core';
import { Sidebar} from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { JournalCard } from '../../features/pages/journal-card/journal-card';
import { MobileNav } from "../mobile-nav/mobile-nav";
import { JournalService } from '../../core/services/journal-service';

@Component({
  selector: 'app-main-layout',
  imports: [ Sidebar, Topbar, JournalCard, MobileNav],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  journalService = inject(JournalService);
  entries = this.journalService.entries;

}
