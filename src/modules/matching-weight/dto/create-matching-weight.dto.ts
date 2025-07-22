import { Type } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateMatchingWeightDto {
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  locationWeight: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  skillWeight: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  majorWeight: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  languageWeight: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  educationWeight: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  levelWeight: number;
}
