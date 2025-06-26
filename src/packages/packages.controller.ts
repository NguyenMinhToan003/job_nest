import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { CreatePackageDto, FilterPacageDto } from './dto/create-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  findInBisiness(@Query() query: FilterPacageDto) {
    return this.packagesService.findInBisiness(query);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('available')
  findAvailablePackages(@Req() req, @Query() query: FilterPacageDto) {
    const employerId = req.user.id;
    return this.packagesService.findAvailablePackages(employerId, query);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('all')
  findAllPackages() {
    return this.packagesService.findAllPackages();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  createPackage(
    @Body() dto: CreatePackageDto,
    @UploadedFile() image: Express.Multer.File | null,
  ) {
    dto.image = image || undefined;
    return this.packagesService.createPackage(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  deletePackage(@Req() req) {
    const packageId = req.params.id;
    return this.packagesService.deletePackage(packageId);
  }
}
