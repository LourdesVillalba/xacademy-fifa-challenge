import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  Player,
  PlayerService,
} from '../../services/player/player';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './players-list.html',
  styleUrl: './players-list.css',
})
export class PlayersListComponent implements OnInit {
  players: Player[] = [];

  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;

  loading = false;
  errorMessage = '';

  filtersForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    club: new FormControl('', { nonNullable: true }),
    position: new FormControl('', { nonNullable: true }),
  });

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.errorMessage = '';

    const filters = this.filtersForm.getRawValue();

    this.playerService
      .getPlayers({
        page: this.page,
        limit: this.limit,
        ...filters,
      })
      .subscribe({
        next: (response) => {
          this.players = response.data;
          this.total = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar los jugadores.';
          this.players = [];
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadPlayers();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.page = 1;
    this.loadPlayers();
  }

  nextPage(): void {
    if (this.page < this.totalPages && !this.loading) {
      this.page++;
      this.loadPlayers();
    }
  }

  previousPage(): void {
    if (this.page > 1 && !this.loading) {
      this.page--;
      this.loadPlayers();
    }
  }
}
