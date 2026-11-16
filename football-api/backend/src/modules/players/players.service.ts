import { Inject, Injectable } from '@nestjs/common';

import {
  IPlayerSearchRepository,
  PlayerQuery,
  PaginatedResult,
} from './interfaces/player-repository.interface';

import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerSearchRepository,
  ) {}

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  getPlayers(
    query: PlayerQuery,
  ): Promise<PaginatedResult<Player>> {
    return this.playerRepository.findPage(query);
  }
}
