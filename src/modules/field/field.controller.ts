import { Controller, Get } from '@nestjs/common';
import { FieldService } from './field.service';
import { Public } from 'src/decorators/customize';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Public()
  @Get()
  async getAllFields() {
    return this.fieldService.findAll();
  }
}
