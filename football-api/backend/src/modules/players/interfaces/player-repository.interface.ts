import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;
}

export interface PlayerQuery {
  page: number;
  limit: number;
  name?: string;
  club?: string;
  position?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPlayerSearchRepository extends IPlayerRepository {
  findPage(query: PlayerQuery): Promise<PaginatedResult<Player>>;
}
