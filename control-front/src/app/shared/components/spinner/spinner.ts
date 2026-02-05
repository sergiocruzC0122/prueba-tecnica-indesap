import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner { 
  spinnerService = inject(SpinnerService);
}
