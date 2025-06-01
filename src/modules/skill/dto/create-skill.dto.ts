import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  majorId: number;
}
