import { IsNotEmpty } from 'class-validator';

export class CreateBenefitDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description?: string;
  @IsNotEmpty()
  icon: string;
}
