import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Not, Repository } from 'typeorm';
import { CreateFieldDto } from './dto/create-field.dto';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async createDefaultFields() {
    const defaultFields = [
      { name: 'Công nghệ thông tin' },
      { name: 'Kinh doanh' },
      { name: 'Hành chính - Văn phòng' },
      { name: 'Kế toán - Tài chính' },
      { name: 'Marketing - Truyền thông' },
      { name: 'Giáo dục - Đào tạo' },
      { name: 'Nhân sự' },
      { name: 'Kỹ thuật' },
      { name: 'Y tế - Sức khỏe' },
      { name: 'Xây dựng' },
      { name: 'Luật - Pháp lý' },
      { name: 'Ngân hàng - Tín dụng' },
      { name: 'Sản xuất - Vận hành' },
      { name: 'Logistics - Chuỗi cung ứng' },
      { name: 'Bất động sản' },
      { name: 'Du lịch - Khách sạn' },
      { name: 'Thiết kế - Mỹ thuật' },
    ];

    const existing = await this.fieldRepository.find();
    if (existing.length === 0) {
      await this.fieldRepository.save(defaultFields);
    }
  }

  async findAll() {
    return this.fieldRepository.find({ relations: { majors: true } });
  }

  async getFieldByJobId(jobId: number) {
    return this.fieldRepository.find({
      where: {
        majors: {
          skills: {
            jobs: { id: jobId },
          },
        },
      },
      relations: { majors: true },
    });
  }

  async findById(id: number) {
    return this.fieldRepository.findOne({
      where: { id },
      relations: {
        majors: {
          skills: true,
        },
      },
    });
  }

  async createFields(dto: CreateFieldDto) {
    const existingField = await this.fieldRepository.findOne({
      where: { name: dto.name },
    });
    if (existingField) {
      throw new BadRequestException('Tên lĩnh vực đã tồn tại');
    }
    return this.fieldRepository.save({
      name: dto.name,
    });
  }

  async updateField(id: number, dto: CreateFieldDto) {
    const field = await this.fieldRepository.findOne({ where: { id } });
    if (!field) {
      throw new BadRequestException('Lĩnh vực không tồn tại');
    }
    const existingField = await this.fieldRepository.findOne({
      where: { name: dto.name, id: Not(id) }, // Ensure we don't match the current field
    });
    if (existingField) {
      throw new BadRequestException('Tên lĩnh vực đã tồn tại');
    }
    field.name = dto.name;
    return this.fieldRepository.save(field);
  }

  async deleteField(id: number) {
    const field = await this.fieldRepository.findOne({ where: { id } });
    if (!field) {
      throw new BadRequestException('Lĩnh vực không tồn tại');
    }
    return this.fieldRepository.remove(field);
  }
}
