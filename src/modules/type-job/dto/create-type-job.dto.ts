import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
