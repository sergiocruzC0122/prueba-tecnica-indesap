import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TimerComponent {
  
  private readonly router = inject(Router);
  
  codigo = signal<number | null>(null);

  iniciarJornada(codigoIngresado: string) {
    const valor = Number(codigoIngresado);

    if (!valor) {
      console.log('Debe ingresar un código válido');
      return;
    }

    this.codigo.set(valor);
    console.log('Código guardado en señal:', this.codigo());

    this.router.navigate(['/timer-table']);
  }
}
