import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { Not, Repository } from 'typeorm';
import { CreateMajorDto } from './dto/create-major.dto';
import { FieldService } from '../field/field.service';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Major)
    private majorRepository: Repository<Major>,
    private fieldService: FieldService,
  ) {}

  async createDefaultMajors(): Promise<Major[]> {
    const existing = await this.majorRepository.find();
    if (existing.length > 0) return existing;

    const fields = await this.fieldService.findAll();
    const fieldMap = Object.fromEntries(fields.map((f) => [f.name, f]));

    const defaultMajors = [
      // IT
      { name: 'Lập trình Web', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Lập trình Mobile', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Phát triển Backend', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Cơ sở dữ liệu', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Khoa học Dữ liệu', field: fieldMap['Công nghệ thông tin'] },
      { name: 'DevOps', field: fieldMap['Công nghệ thông tin'] },
      { name: 'AI/Machine Learning', field: fieldMap['Công nghệ thông tin'] },
      { name: 'An toàn thông tin', field: fieldMap['Công nghệ thông tin'] },

      // Kinh doanh
      { name: 'Bán hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Marketing', field: fieldMap['Kinh doanh'] },
      { name: 'Quản trị kinh doanh', field: fieldMap['Kinh doanh'] },
      { name: 'Tài chính doanh nghiệp', field: fieldMap['Kinh doanh'] },

      // Giáo dục / Hành chính
      { name: 'Thư ký văn phòng', field: fieldMap['Giáo dục'] },
      { name: 'Trợ lý điều hành', field: fieldMap['Giáo dục'] },

      // Kế toán
      { name: 'Kế toán tổng hợp', field: fieldMap['Giáo dục'] },
      { name: 'Kế toán thuế', field: fieldMap['Giáo dục'] },

      // Nhân sự
      { name: 'Tuyển dụng', field: fieldMap['Giáo dục'] },
      { name: 'Đào tạo nhân sự', field: fieldMap['Giáo dục'] },

      // Kỹ thuật
      { name: 'Kỹ thuật cơ khí', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Kỹ thuật điện', field: fieldMap['Công nghệ thông tin'] },

      // Chăm sóc khách hàng
      { name: 'Tư vấn khách hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Tổng đài viên', field: fieldMap['Kinh doanh'] },

      // Bán lẻ
      { name: 'Nhân viên bán hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Quản lý cửa hàng', field: fieldMap['Kinh doanh'] },

      // Giáo viên
      { name: 'Giáo viên tiểu học', field: fieldMap['Giáo dục'] },
      { name: 'Giáo viên tiếng Anh', field: fieldMap['Giáo dục'] },

      // Thu mua
      { name: 'Thu mua nội địa', field: fieldMap['Kinh doanh'] },
      { name: 'Thu mua quốc tế', field: fieldMap['Kinh doanh'] },
    ];

    return this.majorRepository.save(defaultMajors);
  }

  async findOne(where: any) {
    return this.majorRepository.findOne({ where });
  }

  async create(dto: CreateMajorDto) {
    const existingMajor = await this.majorRepository.findOne({
      where: { name: dto.name },
    });
    if (existingMajor) {
      throw new BadRequestException('Chuyên ngành đã tồn tại');
    }
    const major = this.majorRepository.create({
      name: dto.name,
      field: { id: dto.fieldId },
    });
    return this.majorRepository.save(major);
  }

  async findAll() {
    return this.majorRepository.find({ relations: ['field'] });
  }
  async update(id: number, dto: CreateMajorDto) {
    const major = await this.majorRepository.findOne({ where: { id } });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    const existingMajor = await this.majorRepository.findOne({
      where: { name: dto.name, id: Not(id) },
    });
    if (existingMajor) {
      throw new BadRequestException('Chuyên ngành đã tồn tại');
    }
    major.name = dto.name;
    return this.majorRepository.save(major);
  }

  async remove(id: number) {
    const major = await this.majorRepository.findOne({ where: { id } });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    return this.majorRepository.remove(major);
  }

  async getOne(id: number) {
    const major = await this.majorRepository.findOne({
      where: { id },
      relations: {
        field: true,
        skills: true,
      },
    });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    return major;
  }

  async getByJobId(jobId: number) {
    return this.majorRepository.find({
      where: {
        skills: {
          jobs: {
            id: jobId,
          },
        },
      },
    });
  }
}
