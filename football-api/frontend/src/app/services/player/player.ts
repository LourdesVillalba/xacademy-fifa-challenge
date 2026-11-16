
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
}

export interface PlayerFilters {
  page: number;
  limit: number;
  name?: string;
  club?: string;
  position?: string;
}

export interface PaginatedPlayers {
  data: Player[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  // Obtener un jugador por ID
  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  // Obtener listado paginado y filtrado
  getPlayers(filters: PlayerFilters): Observable<PaginatedPlayers> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('limit', filters.limit.toString());

    if (filters.name?.trim()) {
      params = params.set('name', filters.name.trim());
    }

    if (filters.club?.trim()) {
      params = params.set('club', filters.club.trim());
    }

    if (filters.position?.trim()) {
      params = params.set('position', filters.position.trim());
    }

    return this.http.get<PaginatedPlayers>(this.baseUrl, {
      params,
    });
  }
}
