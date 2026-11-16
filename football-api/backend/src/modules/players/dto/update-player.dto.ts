
import {
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class UpdatePlayerDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    @MaxLength(150)
    declare name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    @MaxLength(100)
    declare club: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    @MaxLength(100)
    declare position: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    @MaxLength(100)
    declare nationality: string;

    @IsInt()
    @Min(0)
    @Max(100)
    declare rating: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare speed: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare shooting: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare passing: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare dribbling: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare defending: number;

    @IsInt()
    @Min(0)
    @Max(100)
    declare physic: number;
}
