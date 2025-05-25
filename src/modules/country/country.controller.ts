import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Public } from 'src/decorators/customize';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
}
