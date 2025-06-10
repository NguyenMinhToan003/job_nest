import { IsNotEmpty } from 'class-validator';

export class CreateMatchingWeightDto {
  @IsNotEmpty()
  locationWeight: number;
  @IsNotEmpty()
  skillWeight: number;
  @IsNotEmpty()
  majorWeight: number;
  @IsNotEmpty()
  languageWeight: number;
  @IsNotEmpty()
  educationWeight: number;
  @IsNotEmpty()
  levelWeight: number;
}
