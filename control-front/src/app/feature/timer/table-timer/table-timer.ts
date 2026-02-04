import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-table-timer',
  imports: [],
  templateUrl: './table-timer.html',
  styleUrl: './table-timer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTimer { }
