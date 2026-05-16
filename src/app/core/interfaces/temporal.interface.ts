import { Temporal } from '@js-temporal/polyfill';

export interface CalendarDay {
  date: Temporal.PlainDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export type CalendarWeek = CalendarDay[];

export interface CalendarState {
  grid: CalendarWeek[];
  displayValue: string;
  monthLabel: string;
  weekDayHeaders: string[];
  selectedDate: Temporal.PlainDate | null;
  viewYear: number;   
  viewMonth: number;
}

export interface IDatePickerEngine {
  getState(): CalendarState;
  selectDate(date: Temporal.PlainDate): void;
  clearSelection(): void;
  goToToday(): void;
  prevMonth(): void;
  nextMonth(): void;
  prevYear(): void;
  nextYear(): void;
}
