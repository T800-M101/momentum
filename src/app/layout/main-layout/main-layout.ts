import { Component } from '@angular/core';
import { Sidebar} from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { RouterOutlet } from '@angular/router';
import { JournalCard } from '../../features/pages/journal-card/journal-card';
import { MobileNav } from "../mobile-nav/mobile-nav";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Topbar, JournalCard, MobileNav],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
