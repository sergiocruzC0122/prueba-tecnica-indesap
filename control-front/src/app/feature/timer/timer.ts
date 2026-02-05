import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from './service/timer.service';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../shared/components/spinner/services/spinner.service';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly timerService = inject(TimerService);
  private readonly spinnerService = inject(SpinnerService);

  code = signal<string | null>(null);
  isLoading = signal(false);
  workShifts = signal<any[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWorkShifts('');
  }

  startShift(inputCode: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.spinnerService.show();

    this.timerService.startWorkShift(inputCode).subscribe({
      next: () => {
        this.code.set(inputCode);
        localStorage.setItem('userCode', inputCode);
        this.router.navigate(['/timer-table']);
      },
      error: (err: any) => {
          this.error.set('Este colaborador ya tiene una jornada activa.');
          this.isLoading.set(false)
      },
      complete: () => this.spinnerService.hide()
    });
  }

  loadWorkShifts(code: string) {
    this.spinnerService.show();
    this.timerService.getAllWorkShiftsByCode(code).subscribe({
      next: (res: any) => this.workShifts.set(res.data ?? res),
      error: err => console.error(err),
      complete: () => this.spinnerService.hide()
    });
  }
}
