import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, type WhereOptions } from 'sequelize';

import { PlayerModel } from './player.model';
import {
  IPlayerSearchRepository,
  PlayerQuery,
  PaginatedResult,
} from '../../interfaces/player-repository.interface';

import { Player } from '../../entities/player.entity';

@Injectable()
export class SequelizePlayerRepository implements IPlayerSearchRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }


  async findPage(
    query: PlayerQuery,
  ): Promise<PaginatedResult<Player>> {

    const { page, limit, name, club, position } = query;

    const where: WhereOptions<PlayerModel> = {
      ...(name && {
        longName: { [Op.like]: `%${name}%` },
      }),
      ...(club && {
        clubName: { [Op.like]: `%${club}%` },
      }),
      ...(position && {
        playerPositions: { [Op.like]: `%${position}%` },
      }),
    };

    const offset = (page - 1) * limit;

    const { rows, count } =
      await this.playerModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['id', 'ASC']],
      });

    return {
      data: rows.map((model) => this.mapToEntity(model)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }
    return this.mapToEntity(model);
  }

  private mapToEntity(model: PlayerModel): Player {
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }
    const player = new Player();
    player.id = model.id;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;

    return player;
  }
}
