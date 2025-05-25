import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-employer.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
