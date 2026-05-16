import { Component, computed, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CalendarDay } from '../../../core/interfaces/temporal.interface';
import { DatePickerEngine } from '../../../core/date-picker-engine';
import { Temporal } from '@js-temporal/polyfill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker {
 // ── Inputs ─────────────────────────────────────────────
  modelValue      = input<string | null>(null);
  placeholder     = input<string>('Select a date');
  showClearButton = input<boolean>(true);

  // ── Outputs ────────────────────────────────────────────
  modelValueChange = output<string | null>();
  selectDate       = output<Temporal.PlainDate | null>();

  // ── View children ──────────────────────────────────────
  inputRef   = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  popoverRef = viewChild<ElementRef<HTMLDivElement>>('popoverRef');

  // ── Private ────────────────────────────────────────────
  private engine = new DatePickerEngine();
  private isOpening = false;
  private clickOutsideHandler = (e: MouseEvent) => this.handleClickOutside(e);

  // ── Signals ────────────────────────────────────────────
  isOpen       = signal(false);
  focusedIndex = signal(-1);

  private engineState = signal(this.engine.getState());

  flatGrid       = computed(() => this.engineState().grid.flat());
  displayValue   = computed(() => this.engineState().displayValue);
  monthLabel     = computed(() => this.engineState().monthLabel);
  weekDayHeaders = computed(() => this.engineState().weekDayHeaders);
  monthName      = computed(() => this.monthLabel().split(' ')[0]);
  year           = computed(() => this.monthLabel().split(' ')[1]);

  // ── Constructor ────────────────────────────────────────
  constructor() {
    effect(() => {
      const val = this.modelValue();
      if (val && val !== this.displayValue()) {
        try {
          const date = Temporal.PlainDate.from(val);
          this.engine.selectDate(date);
          this.updateState();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit() {
    document.addEventListener('click', this.clickOutsideHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  // ── State ──────────────────────────────────────────────
  private updateState() {
    this.engineState.set(this.engine.getState());
  }

  private syncFocusedIndex() {
    const grid = this.flatGrid();
    const selectedIndex = grid.findIndex((d) => d.isSelected);
    if (selectedIndex >= 0) { this.focusedIndex.set(selectedIndex); return; }
    const todayIndex = grid.findIndex((d) => d.isToday);
    this.focusedIndex.set(todayIndex >= 0 ? todayIndex : 0);
  }

  private async focusCurrentDay() {
    await new Promise((r) => setTimeout(r));
    const buttons = document.querySelectorAll<HTMLButtonElement>('.date-picker__day');
    buttons[this.focusedIndex()]?.focus();
  }

  // ── Calendar open/close ────────────────────────────────
  async openCalendar() {
    if (this.isOpening) return;
    this.isOpening = true;
    this.isOpen.set(true);
    this.syncFocusedIndex();
    await this.focusCurrentDay();
    this.isOpening = false;
  }

  closeCalendar(shouldBlur = true) {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    if (shouldBlur) this.inputRef()?.nativeElement.blur();
  }

  async toggleCalendar() {
    this.isOpen() ? this.closeCalendar(true) : await this.openCalendar();
  }

  // ── Navigation ─────────────────────────────────────────
  async handlePrevMonth() { this.engine.prevMonth(); this.updateState(); await this.focusCurrentDay(); }
  async handleNextMonth() { this.engine.nextMonth(); this.updateState(); await this.focusCurrentDay(); }
  async handlePrevYear()  { this.engine.prevYear();  this.updateState(); await this.focusCurrentDay(); }
  async handleNextYear()  { this.engine.nextYear();  this.updateState(); await this.focusCurrentDay(); }

  // ── Selection ──────────────────────────────────────────
  handleDateSelect(day: CalendarDay) {
    if (day.isDisabled) return;
    this.engine.selectDate(day.date);
    this.updateState();
    this.modelValueChange.emit(this.engine.getState().displayValue);
    this.selectDate.emit(day.date);
    this.closeCalendar(true);
  }

  handleGoToToday() {
    this.engine.goToToday();
    this.updateState();
    this.modelValueChange.emit(this.engine.getState().displayValue);
    this.selectDate.emit(this.engine.getState().selectedDate);
    this.closeCalendar(true);
  }

  handleClearSelection() {
    this.engine.clearSelection();
    this.updateState();
    this.modelValueChange.emit(null);
    this.selectDate.emit(null);
    this.syncFocusedIndex();
  }

  handleClear() { this.handleClearSelection(); }

  // ── Input events ───────────────────────────────────────
  handleInputFocus() { /* intentionally empty */ }

  async handleInputClick(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen() ? this.closeCalendar(true) : await this.openCalendar();
  }

  async handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.isOpen() ? this.closeCalendar(false) : await this.openCalendar();
    }
    if (event.key === 'Escape' && this.isOpen()) {
      this.closeCalendar(false);
    }
  }

  // ── Calendar keyboard nav ──────────────────────────────
  async handleCalendarKeydown(event: KeyboardEvent) {
    let nextIndex = this.focusedIndex();

    switch (event.key) {
      case 'ArrowRight': event.preventDefault(); event.stopPropagation(); nextIndex++; break;
      case 'ArrowLeft':  event.preventDefault(); event.stopPropagation(); nextIndex--; break;
      case 'ArrowDown':  event.preventDefault(); event.stopPropagation(); nextIndex += 7; break;
      case 'ArrowUp':    event.preventDefault(); event.stopPropagation(); nextIndex -= 7; break;

      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        const day = this.flatGrid()[this.focusedIndex()];
        if (day && !day.isDisabled) this.handleDateSelect(day);
        return;
      }
      case 'Escape':
        this.closeCalendar(false);
        return;
      default:
        return;
    }

    const grid = this.flatGrid();

    if (nextIndex < 0) {
      this.engine.prevMonth();
      this.updateState();
      await new Promise((r) => setTimeout(r));
      this.focusedIndex.set(this.flatGrid().length - 1);
      await this.focusCurrentDay();
      return;
    }

    if (nextIndex >= grid.length) {
      this.engine.nextMonth();
      this.updateState();
      await new Promise((r) => setTimeout(r));
      this.focusedIndex.set(0);
      await this.focusCurrentDay();
      return;
    }

    const currentDay = grid[this.focusedIndex()];
    const nextDay    = grid[nextIndex];

    if (nextDay.date.month > currentDay.date.month || nextDay.date.year > currentDay.date.year) {
      this.engine.nextMonth(); this.updateState();
      await new Promise((r) => setTimeout(r));
    }
    if (nextDay.date.month < currentDay.date.month || nextDay.date.year < currentDay.date.year) {
      this.engine.prevMonth(); this.updateState();
      await new Promise((r) => setTimeout(r));
    }

    const updatedIndex = this.flatGrid().findIndex(
      (d) => Temporal.PlainDate.compare(d.date, nextDay.date) === 0,
    );
    this.focusedIndex.set(updatedIndex >= 0 ? updatedIndex : nextIndex);
    await this.focusCurrentDay();
  }

  handleEscapeKey() { this.closeCalendar(false); }

  // ── Click outside ──────────────────────────────────────
  private handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.date-picker__calendar-btn') || target.closest('.date-picker__input')) return;

    const inputEl   = this.inputRef()?.nativeElement;
    const popoverEl = this.popoverRef()?.nativeElement;

    if (inputEl && !inputEl.contains(target) && popoverEl && !popoverEl.contains(target)) {
      this.closeCalendar(true);
    }
  }

  // ── Template helpers ───────────────────────────────────
  dayClasses(day: CalendarDay, index: number): Record<string, boolean> {
    return {
      'date-picker__day':                true,
      'date-picker__day--focused':       index === this.focusedIndex(),
      'date-picker__day--current-month': day.isCurrentMonth,
      'date-picker__day--other-month':   !day.isCurrentMonth,
      'date-picker__day--today':         day.isToday,
      'date-picker__day--selected':      day.isSelected,
      'date-picker__day--disabled':      day.isDisabled,
    };
  }
}
