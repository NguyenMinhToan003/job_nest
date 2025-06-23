import { IsNotEmpty } from 'class-validator';

export class CreateTagResumeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}
