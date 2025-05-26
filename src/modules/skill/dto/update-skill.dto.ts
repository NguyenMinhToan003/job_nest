import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @IsOptional()
  @IsInt()
  status?: number;
}
