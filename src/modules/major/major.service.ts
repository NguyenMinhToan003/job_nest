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
      // Công nghệ thông tin
      { name: 'Lập trình Web', field: fieldMap['Công nghệ thông tin'] },
      { name: 'Phát triển Mobile', field: fieldMap['Công nghệ thông tin'] },
      { name: 'DevOps & Cloud', field: fieldMap['Công nghệ thông tin'] },
      { name: 'AI & Data Science', field: fieldMap['Công nghệ thông tin'] },

      // Kinh doanh
      { name: 'Bán hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Chăm sóc khách hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Quản lý cửa hàng', field: fieldMap['Kinh doanh'] },
      { name: 'Tư vấn kinh doanh', field: fieldMap['Kinh doanh'] },

      // Hành chính - Văn phòng
      { name: 'Trợ lý điều hành', field: fieldMap['Hành chính - Văn phòng'] },
      { name: 'Thư ký văn phòng', field: fieldMap['Hành chính - Văn phòng'] },
      { name: 'Lễ tân', field: fieldMap['Hành chính - Văn phòng'] },
      { name: 'Quản lý hồ sơ', field: fieldMap['Hành chính - Văn phòng'] },

      // Kế toán - Tài chính
      { name: 'Kế toán tổng hợp', field: fieldMap['Kế toán - Tài chính'] },
      { name: 'Kế toán thuế', field: fieldMap['Kế toán - Tài chính'] },
      { name: 'Kiểm toán nội bộ', field: fieldMap['Kế toán - Tài chính'] },
      { name: 'Chuyên viên tài chính', field: fieldMap['Kế toán - Tài chính'] },

      // Marketing - Truyền thông
      {
        name: 'Digital Marketing',
        field: fieldMap['Marketing - Truyền thông'],
      },
      { name: 'SEO/Content', field: fieldMap['Marketing - Truyền thông'] },
      {
        name: 'PR & Truyền thông',
        field: fieldMap['Marketing - Truyền thông'],
      },
      { name: 'Trade Marketing', field: fieldMap['Marketing - Truyền thông'] },

      // Giáo dục - Đào tạo
      { name: 'Giáo viên tiếng Anh', field: fieldMap['Giáo dục - Đào tạo'] },
      { name: 'Giáo viên mầm non', field: fieldMap['Giáo dục - Đào tạo'] },
      { name: 'Gia sư', field: fieldMap['Giáo dục - Đào tạo'] },
      { name: 'Chuyên viên đào tạo', field: fieldMap['Giáo dục - Đào tạo'] },

      // Nhân sự
      { name: 'Tuyển dụng', field: fieldMap['Nhân sự'] },
      { name: 'C&B (Lương thưởng)', field: fieldMap['Nhân sự'] },
      { name: 'Đào tạo nội bộ', field: fieldMap['Nhân sự'] },
      { name: 'Quản trị nhân sự', field: fieldMap['Nhân sự'] },

      // Kỹ thuật
      { name: 'Kỹ sư cơ khí', field: fieldMap['Kỹ thuật'] },
      { name: 'Kỹ sư điện', field: fieldMap['Kỹ thuật'] },
      { name: 'Bảo trì - Bảo dưỡng', field: fieldMap['Kỹ thuật'] },
      { name: 'Tự động hóa', field: fieldMap['Kỹ thuật'] },

      // Y tế - Sức khỏe
      { name: 'Bác sĩ đa khoa', field: fieldMap['Y tế - Sức khỏe'] },
      { name: 'Y tá - Điều dưỡng', field: fieldMap['Y tế - Sức khỏe'] },
      { name: 'Dược sĩ', field: fieldMap['Y tế - Sức khỏe'] },
      { name: 'Kỹ thuật xét nghiệm', field: fieldMap['Y tế - Sức khỏe'] },

      // Xây dựng
      { name: 'Kỹ sư xây dựng', field: fieldMap['Xây dựng'] },
      { name: 'Giám sát công trình', field: fieldMap['Xây dựng'] },
      { name: 'Thiết kế kết cấu', field: fieldMap['Xây dựng'] },
      { name: 'Dự toán công trình', field: fieldMap['Xây dựng'] },

      // Luật - Pháp lý
      { name: 'Luật sư', field: fieldMap['Luật - Pháp lý'] },
      { name: 'Pháp chế doanh nghiệp', field: fieldMap['Luật - Pháp lý'] },
      { name: 'Tư vấn pháp lý', field: fieldMap['Luật - Pháp lý'] },
      { name: 'Thẩm phán / Kiểm sát', field: fieldMap['Luật - Pháp lý'] },

      // Ngân hàng - Tín dụng
      { name: 'Giao dịch viên', field: fieldMap['Ngân hàng - Tín dụng'] },
      { name: 'Chuyên viên tín dụng', field: fieldMap['Ngân hàng - Tín dụng'] },
      { name: 'Kiểm soát nội bộ', field: fieldMap['Ngân hàng - Tín dụng'] },
      { name: 'Chuyên viên thẻ', field: fieldMap['Ngân hàng - Tín dụng'] },

      // Logistics - Chuỗi cung ứng
      {
        name: 'Nhân viên kho vận',
        field: fieldMap['Logistics - Chuỗi cung ứng'],
      },
      { name: 'Xuất nhập khẩu', field: fieldMap['Logistics - Chuỗi cung ứng'] },
      {
        name: 'Chuyên viên mua hàng',
        field: fieldMap['Logistics - Chuỗi cung ứng'],
      },
      {
        name: 'Vận chuyển hàng hóa',
        field: fieldMap['Logistics - Chuỗi cung ứng'],
      },

      // Bất động sản
      { name: 'Chuyên viên môi giới', field: fieldMap['Bất động sản'] },
      { name: 'Quản lý dự án BĐS', field: fieldMap['Bất động sản'] },
      { name: 'Tư vấn BĐS', field: fieldMap['Bất động sản'] },
      { name: 'Thẩm định giá', field: fieldMap['Bất động sản'] },

      // Du lịch - Khách sạn
      { name: 'Lễ tân khách sạn', field: fieldMap['Du lịch - Khách sạn'] },
      { name: 'Hướng dẫn viên', field: fieldMap['Du lịch - Khách sạn'] },
      { name: 'Quản lý nhà hàng', field: fieldMap['Du lịch - Khách sạn'] },
      { name: 'Đặt phòng - Booking', field: fieldMap['Du lịch - Khách sạn'] },

      // Thiết kế - Mỹ thuật
      { name: 'Thiết kế đồ họa', field: fieldMap['Thiết kế - Mỹ thuật'] },
      { name: 'Thiết kế nội thất', field: fieldMap['Thiết kế - Mỹ thuật'] },
      { name: 'Thiết kế thời trang', field: fieldMap['Thiết kế - Mỹ thuật'] },
      { name: 'Chỉnh sửa video', field: fieldMap['Thiết kế - Mỹ thuật'] },
    ];
    const majors = defaultMajors.map((major) => {
      const field = fieldMap[major.field.name];
      return this.majorRepository.create({
        name: major.name,
        field: { id: field.id },
      });
    });
    return this.majorRepository.save(majors);
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
