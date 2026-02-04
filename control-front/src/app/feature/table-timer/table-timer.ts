import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-timer',
  imports: [CommonModule],
  templateUrl: './table-timer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableTimerComponent {

  private readonly router = inject(Router);

  // ======= SEÑALES (estado de la vista) =======
  codigo = signal<number>(12345);               // vendrá del login después
  nombre = signal<string>('Nicolás Cruz');      // vendrá del servicio después

  tiempoInicio = signal<Date | null>(null);
  tiempoFin = signal<Date | null>(null);
  segundosTranscurridos = signal<number>(0);

  corriendo = signal<boolean>(true);

  private intervaloId: any = null;

  // ======= ACCIÓN DEL BOTÓN =======
  toggleJornada() {
    if (this.corriendo()) {
      // Iniciar jornada
      this.tiempoInicio.set(new Date());
      this.corriendo.set(true);

      this.intervaloId = setInterval(() => {
        this.segundosTranscurridos.update(s => s + 1);
      }, 1000);

      this.router.navigate(['/inicio']);
    } 
  }

  // ======= CÁLCULOS DERIVADOS =======
  get tiempoFormateado() {
    const s = this.segundosTranscurridos();
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  formatoHora(fecha: Date | null) {
    if (!fecha) return '—';
    return fecha.toLocaleTimeString();
  }
}
