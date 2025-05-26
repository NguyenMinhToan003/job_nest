import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLevelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
