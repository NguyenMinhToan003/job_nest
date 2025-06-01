import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLevelDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
