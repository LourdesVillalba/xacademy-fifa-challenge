import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

import Chart from 'chart.js/auto';

import {
  Player,
  PlayerService,
} from '../../services/player/player';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class PlayerComponent implements OnInit, OnDestroy {
  player?: Player;
  loading = true;
  errorMessage = '';

  private chart?: Chart<'radar'>;

  @ViewChild('skillsCanvas')
  set skillsCanvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (ref && this.player) {
      this.createChart(ref.nativeElement);
    }
  }

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.errorMessage = 'ID de jugador inválido.';
      this.loading = false;
      return;
    }

    this.playerService.getPlayer(id).subscribe({
      next: (player) => {
        this.player = player;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.status === 404
            ? 'El jugador no existe.'
            : 'No se pudo cargar el jugador.';

        this.loading = false;
      },
    });
  }

  private createChart(canvas: HTMLCanvasElement): void {
    if (!this.player) return;

    this.chart?.destroy();

    this.chart = new Chart(canvas, {
      type: 'radar',

      data: {
        labels: [
          'Velocidad',
          'Tiro',
          'Pase',
          'Regate',
          'Defensa',
          'Físico',
        ],

        datasets: [
          {
            label: 'Habilidades',
            data: [
              this.player.speed,
              this.player.shooting,
              this.player.passing,
              this.player.dribbling,
              this.player.defending,
              this.player.physic,
            ],
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: 'rgb(37, 99, 235)',
            pointBackgroundColor: 'rgb(37, 99, 235)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              display: false,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}