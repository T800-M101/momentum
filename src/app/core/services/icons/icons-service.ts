import { Injectable, signal } from '@angular/core';
import {
  NotebookPen,
  NotebookTabs,
  CalendarDays,
  Settings,
  SquarePen,
  Moon,
  Sun,
  LogOut,
  Search,
  User,
  
} from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  private _icons = signal({
  NotebookPen,
  NotebookTabs,
  CalendarDays,
  Settings,
  SquarePen,
  Moon,
  Sun,
  LogOut,
  Search,
  User
  });

  readonly icons = this._icons.asReadonly();

}
