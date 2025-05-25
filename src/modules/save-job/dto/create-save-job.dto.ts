import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSaveJobDto {
  @IsNotEmpty()
  @IsInt()
  jobId: number;
}
