import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableTimerService } from './services/table-timer.service';
import { SpinnerService } from '../../shared/components/spinner/services/spinner.service';

@Component({
  selector: 'app-table-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-timer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTimerComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly timerService = inject(TableTimerService);
  private readonly spinnerService = inject(SpinnerService);

  code = signal<string>('');
  employeeName = signal<string>('');
  startTime = signal<Date | null>(null);
  endTime = signal<Date | null>(null);
  totalTime = signal<string>('');

  isRunning = signal<boolean>(true);
  workShifts = signal<any[]>([]);

  elapsedSeconds = signal<number>(0);
  private intervalId: any = null;

  ngOnInit(): void {
    const storedCode = localStorage.getItem('userCode') ?? '';
    this.code.set(storedCode);

    if (storedCode) this.loadWorkShifts(storedCode);
  }

  loadWorkShifts(code: string) {
    this.spinnerService.show();
    this.timerService.getWorkShiftsByCode(code).subscribe({
      next: (response: any) => {
        const shifts = response.data ?? response;
        this.workShifts.set(shifts);

        if (shifts.length > 0) {
          const firstShift = shifts[0];
          const start = new Date(firstShift.start_time);
          const end = firstShift.end_time ? new Date(firstShift.end_time) : null;

          this.employeeName.set(firstShift.first_name);
          this.startTime.set(start);
          this.endTime.set(end);
          this.totalTime.set(firstShift.total_time);

          this.startTimer(start, end);
        }
      },
      error: err => console.error('Error fetching work shifts:', err),
      complete: () => this.spinnerService.hide()
    });
  }

  startTimer(startDate: Date | null, endDate: Date | null) {
    if (!startDate) return;

    const now = new Date();
    const initialSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
    this.elapsedSeconds.set(initialSeconds);

    if (endDate) {
      this.isRunning.set(false);
      if (this.intervalId) clearInterval(this.intervalId);
      return;
    }

    this.isRunning.set(true);
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);
    }, 1000);
  }

  finishWorkShift() {
    this.spinnerService.show();
    const currentCode = this.code();
    if (!currentCode) return;

    this.timerService.endWorkShift(currentCode).subscribe({
      next: () => {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isRunning.set(false);
        this.router.navigate(['/inicio']);
      },
      error: err => console.error('Error finishing work shift:', err),
      complete: () => this.spinnerService.hide()
    });
  }

  formatTime(date: Date | null) {
    if (!date) return '—';
    return date.toLocaleTimeString();
  }

  get formattedElapsedTime() {
    const seconds = this.elapsedSeconds();
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  }
}
