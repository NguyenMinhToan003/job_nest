import { IsNotEmpty } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  name: string;
}
