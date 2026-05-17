import { Temporal } from "@js-temporal/polyfill";
import { CalendarDay, CalendarState, CalendarWeek, IDatePickerEngine } from "../interfaces/temporal.interface";


const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export class DatePickerEngine implements IDatePickerEngine {
  private viewDate: Temporal.PlainDate;
  private selectedDate: Temporal.PlainDate | null = null;
  private today: Temporal.PlainDate;

  constructor(initialDate?: Temporal.PlainDate) {
    this.today = Temporal.Now.plainDateISO();
    this.viewDate = initialDate ?? this.today;
  }

  // ── Public API ────────────────────────────────────────

  getState(): CalendarState {
    return {
      viewYear: this.viewDate.year,
      viewMonth: this.viewDate.month,
      selectedDate: this.selectedDate,
      displayValue: this.formatDisplayValue(),
      grid: this.buildGrid(),
      monthLabel: `${MONTH_NAMES[this.viewDate.month - 1]} ${this.viewDate.year}`,
      weekDayHeaders: WEEK_DAYS,
    };
  }

  nextMonth(): void {
    this.viewDate = this.viewDate.add({ months: 1 });
  }

  prevMonth(): void {
    this.viewDate = this.viewDate.subtract({ months: 1 });
  }

  nextYear(): void {
    this.viewDate = this.viewDate.add({ years: 1 });
  }

  prevYear(): void {
    this.viewDate = this.viewDate.subtract({ years: 1 });
  }

  selectDate(date: Temporal.PlainDate): void {
    this.selectedDate = date;
    // Sync view to the selected month
    this.viewDate = date;
  }

  goToToday(): void {
    this.viewDate = this.today;
    this.selectedDate = this.today;
  }

  clearSelection(): void {
    this.selectedDate = null;
  }

  private buildGrid(): CalendarWeek[] {
    const firstOfMonth = this.viewDate.with({ day: 1 });

    // Temporal uses ISO weekday: 1=Mon, 7=Sun → convert to 0=Sun
    const rawDayOfWeek = firstOfMonth.dayOfWeek % 7; // Mon=1→1, Sun=7→0
    const startOffset = rawDayOfWeek; // days to go back

    // Start of the grid (Sunday of the first week)
    const gridStart = firstOfMonth.subtract({ days: startOffset });

    const grid: CalendarWeek[] = [];

    for (let week = 0; week < 6; week++) {
      const row: CalendarDay[] = [];
      for (let day = 0; day < 7; day++) {
        const date = gridStart.add({ days: week * 7 + day });
        row.push(this.buildDay(date));
      }
      grid.push(row);
    }

    return grid;
  }

  private buildDay(date: Temporal.PlainDate): CalendarDay {
    return {
      date,
      isCurrentMonth:
        date.month === this.viewDate.month && date.year === this.viewDate.year,
      isToday: Temporal.PlainDate.compare(date, this.today) === 0,
      isSelected: this.selectedDate
        ? Temporal.PlainDate.compare(date, this.selectedDate) === 0
        : false,
      isDisabled: false, // extend here: e.g. date < minDate || date > maxDate
    };
  }

  private formatDisplayValue(): string {
    if (!this.selectedDate) return "";
    const { year, month, day } = this.selectedDate;
    return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
  }
}
