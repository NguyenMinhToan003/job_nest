import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly uploadService: UploadService,
  ) {}

  async getAllCountries() {
    return this.countryRepository.find({
      relations: {
        employees: true,
      },
    });
  }
  async createDefaultCountries() {
    const defaultCountries = [
      {
        name: 'Trung Quốc',
        flag: 'https://res.cloudinary.com/dprryejno/image/upload/v1750646243/JOB_NEST/yhh8ehkt3m4gzchwsyuz.jpg',
        publicId: 'JOB_NEST/yhh8ehkt3m4gzchwsyuz',
      },
      {
        name: 'Việt Nam',
        flag: 'https://res.cloudinary.com/dprryejno/image/upload/v1750646254/JOB_NEST/oxd5q4kyfnvsdkqywhmw.jpg',
        publicId: 'JOB_NEST/oxd5q4kyfnvsdkqywhmw',
      },
    ];
    for (const country of defaultCountries) {
      const existingCountry = await this.countryRepository.findOne({
        where: { name: country.name },
      });
      if (!existingCountry) {
        const newCountry = this.countryRepository.create(country);
        await this.countryRepository.save(newCountry);
      }
    }
  }

  async createCountry(dto: CreateCountryDto, flag: Express.Multer.File) {
    if (!flag) {
      throw new BadRequestException(' Cờ quốc gia là bắt buộc');
    }

    const typefile = flag.originalname.split('.').pop().toLowerCase();
    const allowedTypes = ['png', 'jpg', 'jpeg'];
    if (!allowedTypes.includes(typefile)) {
      throw new BadRequestException(
        `Chỉ hỗ trợ các định dạng: ${allowedTypes.join(', ')}`,
      );
    }
    const countryExists = await this.countryRepository.findOne({
      where: { name: dto.name },
    });
    if (countryExists) {
      throw new BadRequestException('Tên quốc gia đã tồn tại');
    }
    const uploadedFlag = await this.uploadService.uploadFile([flag]);
    const country = this.countryRepository.create({
      name: dto.name,
      flag: uploadedFlag[0].secure_url,
      publicId: uploadedFlag[0].display_name,
    });
    return this.countryRepository.save(country);
  }

  async updateCountry(
    id: number,
    dto: CreateCountryDto,
    flag?: Express.Multer.File,
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: id },
    });
    if (!country) {
      throw new BadRequestException('Quốc gia không tồn tại');
    }
    if (flag) {
      const typefile = flag.originalname.split('.').pop().toLowerCase();
      const allowedTypes = ['png', 'jpg', 'jpeg'];
      if (!allowedTypes.includes(typefile)) {
        throw new BadRequestException(
          `Chỉ hỗ trợ các định dạng: ${allowedTypes.join(', ')}`,
        );
      }
      const uploadedFlag = await this.uploadService.uploadFile([flag]);
      country.flag = uploadedFlag[0].secure_url;
      country.publicId = uploadedFlag[0].public_id;
    }
    if (dto.name) {
      const countryExists = await this.countryRepository.findOne({
        where: { name: dto.name, id: Not(id) },
      });
      if (countryExists) {
        throw new BadRequestException('Tên quốc gia đã tồn tại');
      }
      country.name = dto.name;
    }
    return this.countryRepository.save(country);
  }

  async deleteCountry(id: number) {
    const country = await this.countryRepository.findOne({
      where: { id: id },
    });
    if (!country) {
      throw new BadRequestException('Quốc gia không tồn tại');
    }
    this.uploadService.deleteFile(country.publicId);
    return this.countryRepository.remove(country);
  }
}
