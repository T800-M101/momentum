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
  ChevronDown,
  Images,
  EllipsisVertical,
  ImagePlus,
  Pencil,
  Trash2

} from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  readonly icons = {
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
  ChevronDown,
  Images,
  EllipsisVertical,
  ImagePlus,
  Pencil,
  Trash2
  } as const;

}
