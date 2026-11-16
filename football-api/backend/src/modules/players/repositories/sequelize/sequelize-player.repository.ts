import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, type WhereOptions } from 'sequelize';

import { PlayerModel } from './player.model';
import {
  IPlayerSearchRepository,
  PlayerQuery,
  PaginatedResult,
  UpdatePlayerData,
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

  async updateById(
    id: number,
    data: UpdatePlayerData,
  ): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);

    if (!model) {
      return undefined;
    }

    // Conservamos las posiciones secundarias del jugador.
    const secondaryPositions = (model.playerPositions ?? '')
      .split(',')
      .slice(1)
      .map((position) => position.trim())
      .filter((position) => position && position !== data.position);

    const positions = [
      data.position.trim(),
      ...secondaryPositions,
    ].join(', ');

    await model.update({
      longName: data.name.trim(),
      clubName: data.club.trim(),
      playerPositions: positions,
      nationalityName: data.nationality.trim(),
      overall: data.rating,
      pace: data.speed,
      shooting: data.shooting,
      passing: data.passing,
      dribbling: data.dribbling,
      defending: data.defending,
      physic: data.physic,
    });

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
    player.defending = model.defending ?? 0;
    player.physic = model.physic ?? 0;

    return player;
  }
}
