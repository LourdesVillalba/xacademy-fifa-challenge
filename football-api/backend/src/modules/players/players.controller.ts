import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Put,
  ValidationPipe,
} from '@nestjs/common';

import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('api/players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
  ) {}

  // Listar jugadores con paginación y filtros
  @Get()
  async getPlayers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('name') name?: string,
    @Query('club') club?: string,
    @Query('position') position?: string,
  ) {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'La página debe ser mayor a 0 y el límite debe estar entre 1 y 100.',
      );
    }

    for (const [key, value] of Object.entries({
      name,
      club,
      position,
    })) {
      if (
        value !== undefined &&
        (typeof value !== 'string' || value.length > 100)
      ) {
        throw new BadRequestException(
          `El filtro ${key} debe ser un texto de hasta 100 caracteres.`,
        );
      }
    }

    const result = await this.playersService.getPlayers({
      page,
      limit,
      name: name?.trim(),
      club: club?.trim(),
      position: position?.trim(),
    });

    return {
      ...result,
      data: result.data.map(
        (player) => new PlayerDto(player),
      ),
    };
  }

  // Obtener un jugador por ID
  @Get(':id')
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto> {
    const player = await this.playersService.getPlayerById(id);

    if (!player) {
      throw new NotFoundException(
        `Player with ID ${id} not found.`,
      );
    }

    return new PlayerDto(player);
  }


  @Put(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    data: UpdatePlayerDto,
  ): Promise<PlayerDto> {
    const player = await this.playersService.updatePlayer(id, data);

    if (!player) {
      throw new NotFoundException(
        `Jugador con ID ${id} no encontrado.`,
      );
    }

    return new PlayerDto(player);
  }
}
