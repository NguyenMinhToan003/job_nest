import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMajorDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  fieldId: number;
  @IsOptional()
  status?: number;
}
