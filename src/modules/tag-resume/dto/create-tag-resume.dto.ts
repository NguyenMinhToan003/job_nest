import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagResumeDto {
  @IsNotEmpty()
  @MaxLength(25, {
    message: 'Tên thẻ không được vượt quá 25 ký tự',
  })
  name: string;

  @IsNotEmpty()
  color: string;
}
