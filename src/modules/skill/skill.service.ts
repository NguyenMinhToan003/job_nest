import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { MajorService } from '../major/major.service';
import { Major } from '../major/entities/major.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private majorService: MajorService,
  ) {}

  async createDefaultSkills() {
    const majors = await this.majorService.createDefaultMajors();
    const majorMap = Object.fromEntries(majors.map((m) => [m.name, m]));

    const skillMap: Record<string, string[]> = {
      'Lập trình Web': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue'],
      'Lập trình Mobile': ['Flutter', 'React Native', 'Swift', 'Kotlin'],
      'Phát triển Backend': ['Node.js', 'Java', 'NestJS', 'MySQL'],
      'Cơ sở dữ liệu': ['SQL', 'MongoDB', 'PostgreSQL'],
      'Khoa học Dữ liệu': ['Python', 'Pandas', 'Machine Learning'],
      DevOps: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      'AI/Machine Learning': ['TensorFlow', 'Scikit-Learn', 'PyTorch'],
      'An toàn thông tin': ['PenTest', 'Network Security', 'Firewall'],

      'Bán hàng': ['Kỹ năng giao tiếp', 'Chốt sale', 'CRM'],
      Marketing: ['SEO', 'Google Ads', 'Content marketing'],
      'Quản trị kinh doanh': ['Phân tích thị trường', 'Chiến lược kinh doanh'],
      'Tài chính doanh nghiệp': ['Dự báo tài chính', 'Phân tích tài chính'],

      'Thư ký văn phòng': ['Tin học văn phòng', 'Lên lịch', 'Quản lý tài liệu'],
      'Trợ lý điều hành': ['Lập kế hoạch', 'Tổ chức họp', 'Giao tiếp'],

      'Kế toán tổng hợp': ['Excel', 'Báo cáo tài chính'],
      'Kế toán thuế': ['Luật thuế', 'Kê khai thuế'],

      'Tuyển dụng': ['Phỏng vấn', 'Đánh giá ứng viên'],
      'Đào tạo nhân sự': ['Kỹ năng giảng dạy', 'Soạn giáo trình'],

      'Kỹ thuật cơ khí': ['AutoCAD', 'SolidWorks'],
      'Kỹ thuật điện': ['Điện tử cơ bản', 'Mạch điện'],

      'Tư vấn khách hàng': ['Giao tiếp', 'Xử lý tình huống'],
      'Tổng đài viên': ['Kỹ năng lắng nghe', 'Phần mềm tổng đài'],

      'Nhân viên bán hàng': ['Bán hàng POS', 'Chăm sóc khách'],
      'Quản lý cửa hàng': ['Quản lý nhân viên', 'Báo cáo doanh số'],

      'Giáo viên tiểu học': ['Soạn giáo án', 'Quản lý lớp học'],
      'Giáo viên tiếng Anh': ['Phát âm', 'Ngữ pháp tiếng Anh'],

      'Thu mua nội địa': ['Tìm nhà cung cấp', 'Đàm phán'],
      'Thu mua quốc tế': ['Incoterms', 'Tiếng Anh chuyên ngành'],
    };

    const skillsMap = new Map<string, { name: string; majors: Major[] }>();

    for (const [majorName, skills] of Object.entries(skillMap)) {
      const major = majorMap[majorName];
      if (!major) continue;

      for (const skillName of skills) {
        if (!skillsMap.has(skillName)) {
          skillsMap.set(skillName, { name: skillName, majors: [major] });
        } else {
          skillsMap.get(skillName)!.majors.push(major);
        }
      }
    }

    const skillEntities = Array.from(skillsMap.values()).map((s) =>
      this.skillRepository.create({
        name: s.name,
        status: 1,
        major: s.majors[0],
      }),
    );

    await this.skillRepository.save(skillEntities);
  }

  async create(dto: CreateSkillDto) {
    const existingSkill = await this.skillRepository.findOneBy({
      name: dto.name,
    });
    if (existingSkill) {
      throw new BadRequestException('Kĩ năng đã tồn tại');
    }
    const skill = this.skillRepository.create({
      name: dto.name,
      status: 1,
      major: { id: dto.majorId },
    });
    return this.skillRepository.save(skill);
  }

  async findAll() {
    return this.skillRepository.find({
      where: { status: 1 },
    });
  }

  async findAllByAdmin() {
    return this.skillRepository.find();
  }

  async update(id: number, dto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException('Kĩ năng không tồn tại');
    }
    const existingSkill = await this.skillRepository.findOneBy({
      name: dto.name,
    });
    if (existingSkill && existingSkill.id !== +id) {
      throw new BadRequestException('Tên kĩ năng đã tồn tại');
    }

    if (dto.name !== undefined) {
      skill.name = dto.name;
    }
    if (dto.status !== undefined) {
      skill.status = dto.status;
    }
    if (dto.majorId !== undefined) {
      skill.major = { id: dto.majorId } as Major;
    }
    return this.skillRepository.save(skill);
  }

  async delete(id: number) {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: {
        jobs: true,
      },
    });
    if (!skill) {
      throw new BadRequestException('Kĩ năng không tồn tại');
    }
    if (skill.jobs && skill.jobs.length > 0) {
      throw new BadRequestException(
        'Không thể xóa kỹ năng này vì nó đang được sử dụng trong các công việc',
      );
    }
    return this.skillRepository.remove(skill);
  }

  async paginate(page: number, limit: number) {
    const [items, total] = await this.skillRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        major: {
          field: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      items,
      total,
      page,
      totalPages,
      limit,
    };
  }
}
