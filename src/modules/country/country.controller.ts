import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  async getAllCountries() {
    return this.countryService.getAllCountries();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @UseInterceptors(FileInterceptor('flag'))
  @Post()
  async createCountry(
    @UploadedFile() flag: Express.Multer.File,
    @Body() dto: CreateCountryDto,
  ) {
    return this.countryService.createCountry(dto, flag);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @UseInterceptors(FileInterceptor('flag'))
  @Patch(':id')
  async updateCountry(
    @Body('id') id: number,
    @UploadedFile() flag: Express.Multer.File,
    @Body() dto: CreateCountryDto,
  ) {
    return this.countryService.updateCountry(id, dto, flag);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async deleteCountry(@Body('id') id: number) {
    return this.countryService.deleteCountry(id);
  }
}
