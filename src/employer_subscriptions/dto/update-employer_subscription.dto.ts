import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployerSubscriptionDto } from './create-employer_subscription.dto';

export class UpdateEmployerSubscriptionDto extends PartialType(
  CreateEmployerSubscriptionDto,
) {}
