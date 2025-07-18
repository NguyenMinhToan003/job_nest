import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Like, Repository } from 'typeorm';
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
      // Công nghệ thông tin
      'Lập trình Web': ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
      'Phát triển Mobile': [
        'Flutter',
        'React Native',
        'Swift',
        'Kotlin',
        'Firebase',
      ],
      'DevOps & Cloud': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
      'AI & Data Science': [
        'Python',
        'Pandas',
        'Machine Learning',
        'Scikit-learn',
        'TensorFlow',
      ],

      // Kinh doanh
      'Bán hàng': ['Giao tiếp', 'Chốt đơn', 'CRM', 'Tư vấn khách hàng'],
      'Chăm sóc khách hàng': [
        'Lắng nghe',
        'Giải quyết khiếu nại',
        'Call Center',
        'Kiên nhẫn',
      ],
      'Quản lý cửa hàng': [
        'Quản lý nhân viên',
        'POS',
        'Báo cáo doanh số',
        'Quản lý hàng tồn',
      ],
      'Tư vấn kinh doanh': [
        'Phân tích thị trường',
        'Đàm phán',
        'Lập kế hoạch kinh doanh',
        'Thuyết trình',
      ],

      // Hành chính - Văn phòng
      'Trợ lý điều hành': [
        'Giao tiếp',
        'Lập kế hoạch',
        'Soạn thảo văn bản',
        'Quản lý lịch',
      ],
      'Thư ký văn phòng': [
        'Tin học văn phòng',
        'Lưu trữ hồ sơ',
        'Soạn thảo hợp đồng',
        'Đặt lịch họp',
      ],
      'Lễ tân': [
        'Đón tiếp khách',
        'Quản lý điện thoại',
        'Ứng xử khéo léo',
        'Ghi nhận thông tin',
      ],
      'Quản lý hồ sơ': [
        'Sắp xếp tài liệu',
        'Lưu trữ số',
        'Kiểm tra hồ sơ',
        'Bảo mật thông tin',
      ],

      // Kế toán - Tài chính
      'Kế toán tổng hợp': ['Excel', 'Hạch toán', 'Lập BCTC', 'Quản lý sổ sách'],
      'Kế toán thuế': [
        'Kê khai thuế',
        'Luật thuế',
        'Hóa đơn điện tử',
        'Báo cáo thuế',
      ],
      'Kiểm toán nội bộ': [
        'Phân tích tài chính',
        'Kiểm tra chứng từ',
        'Báo cáo rủi ro',
        'Tuân thủ nội quy',
      ],
      'Chuyên viên tài chính': [
        'Dự báo tài chính',
        'Phân tích dòng tiền',
        'Kế hoạch đầu tư',
        'Tài chính doanh nghiệp',
      ],

      // Marketing - Truyền thông
      'Digital Marketing': [
        'SEO',
        'Google Ads',
        'Facebook Ads',
        'Email Marketing',
      ],
      'SEO/Content': [
        'Viết bài chuẩn SEO',
        'Nghiên cứu từ khóa',
        'Tối ưu Onpage',
        'Content Strategy',
      ],
      'PR & Truyền thông': [
        'Quan hệ báo chí',
        'Sáng tạo nội dung',
        'Tổ chức sự kiện',
        'Xây dựng thương hiệu',
      ],
      'Trade Marketing': [
        'POSM',
        'Chương trình khuyến mãi',
        'Kênh phân phối',
        'Đàm phán',
      ],

      // Giáo dục - Đào tạo
      'Giáo viên tiếng Anh': [
        'Phát âm',
        'Ngữ pháp',
        'Lesson Plan',
        'Phản xạ tiếng Anh',
      ],
      'Giáo viên mầm non': [
        'Quản lý lớp',
        'Chăm sóc trẻ',
        'Soạn giáo án',
        'Kỹ năng mềm',
      ],
      'Gia sư': [
        'Kỹ năng truyền đạt',
        'Ôn tập kiến thức',
        'Soạn bài tập',
        'Lắng nghe học sinh',
      ],
      'Chuyên viên đào tạo': [
        'Soạn giáo trình',
        'Đánh giá học viên',
        'Tổ chức lớp học',
        'Kỹ năng giảng dạy',
      ],

      // Nhân sự
      'Tuyển dụng': [
        'Đăng tin',
        'Phỏng vấn',
        'Đánh giá ứng viên',
        'Tìm kiếm hồ sơ',
      ],
      'C&B (Lương thưởng)': [
        'Tính lương',
        'Phúc lợi',
        'Bảo hiểm',
        'Bảng lương',
      ],
      'Đào tạo nội bộ': [
        'Kế hoạch đào tạo',
        'Slide thuyết trình',
        'Tổ chức lớp học',
        'Đánh giá nhân viên',
      ],
      'Quản trị nhân sự': [
        'Quy trình nhân sự',
        'Nội quy công ty',
        'Chính sách HR',
        'Giải quyết khiếu nại',
      ],

      // Kỹ thuật
      'Kỹ sư cơ khí': [
        'AutoCAD',
        'SolidWorks',
        'Gia công cơ khí',
        'Đọc bản vẽ kỹ thuật',
      ],
      'Kỹ sư điện': ['PLC', 'Điện công nghiệp', 'Mạch điện', 'Thi công điện'],
      'Bảo trì - Bảo dưỡng': [
        'Sửa chữa máy móc',
        'Bảo trì thiết bị',
        'Lập kế hoạch bảo dưỡng',
        'Đọc sơ đồ kỹ thuật',
      ],
      'Tự động hóa': ['Lập trình PLC', 'Sensor', 'Robot công nghiệp', 'SCADA'],

      // Y tế - Sức khỏe
      'Bác sĩ đa khoa': [
        'Khám bệnh',
        'Chẩn đoán',
        'Xét nghiệm',
        'Tư vấn điều trị',
      ],
      'Y tá - Điều dưỡng': [
        'Chăm sóc bệnh nhân',
        'Tiêm truyền',
        'Theo dõi dấu hiệu',
        'Sơ cứu',
      ],
      'Dược sĩ': [
        'Kê đơn thuốc',
        'Dược lý học',
        'Tư vấn sử dụng thuốc',
        'Quản lý kho thuốc',
      ],
      'Kỹ thuật xét nghiệm': [
        'Lấy mẫu',
        'Máy xét nghiệm',
        'Phân tích kết quả',
        'Vệ sinh phòng lab',
      ],

      // Xây dựng
      'Kỹ sư xây dựng': [
        'AutoCAD',
        'Thiết kế kết cấu',
        'Giám sát công trình',
        'Bóc tách khối lượng',
      ],
      'Giám sát công trình': [
        'Lập kế hoạch thi công',
        'Theo dõi tiến độ',
        'An toàn lao động',
        'Ghi nhật ký',
      ],
      'Thiết kế kết cấu': [
        'ETABS',
        'SAP2000',
        'Thiết kế bản vẽ',
        'Phân tích tải trọng',
      ],
      'Dự toán công trình': [
        'Dự toán chi phí',
        'Đọc bản vẽ',
        'Bóc tách vật tư',
        'Sử dụng phần mềm GXD',
      ],

      // Luật - Pháp lý
      'Luật sư': [
        'Luật dân sự',
        'Soạn hợp đồng',
        'Bào chữa',
        'Tư vấn pháp luật',
      ],
      'Pháp chế doanh nghiệp': [
        'Luật doanh nghiệp',
        'Hợp đồng thương mại',
        'Thẩm định pháp lý',
        'Rủi ro pháp lý',
      ],
      'Tư vấn pháp lý': [
        'Tư vấn cá nhân',
        'Luật lao động',
        'Giải quyết tranh chấp',
        'Luật thuế',
      ],
      'Thẩm phán / Kiểm sát': [
        'Luật tố tụng',
        'Xét xử',
        'Trình bày bản án',
        'Điều tra hồ sơ',
      ],

      // Ngân hàng - Tín dụng
      'Giao dịch viên': [
        'Giao dịch tiền mặt',
        'Kiểm kê quỹ',
        'Xác minh thông tin',
        'Bán chéo sản phẩm',
      ],
      'Chuyên viên tín dụng': [
        'Phân tích hồ sơ',
        'Thẩm định tài chính',
        'Tư vấn vay vốn',
        'Giải ngân',
      ],
      'Kiểm soát nội bộ': [
        'Rủi ro tín dụng',
        'Đối chiếu số liệu',
        'Kiểm tra quy trình',
        'Báo cáo sai phạm',
      ],
      'Chuyên viên thẻ': [
        'Phát hành thẻ',
        'Ngăn chặn gian lận',
        'Chăm sóc khách hàng',
        'Xử lý sự cố',
      ],

      // Logistics - Chuỗi cung ứng
      'Nhân viên kho vận': [
        'Kiểm hàng',
        'Sắp xếp kho',
        'Nhập xuất hàng',
        'Dán tem mã vạch',
      ],
      'Xuất nhập khẩu': [
        'Khai báo hải quan',
        'Incoterms',
        'Bill of Lading',
        'HS code',
      ],
      'Chuyên viên mua hàng': [
        'Đàm phán',
        'Tìm NCC',
        'So sánh giá',
        'Quản lý hợp đồng',
      ],
      'Vận chuyển hàng hóa': [
        'Theo dõi đơn hàng',
        'Lên lộ trình',
        'Tài xế',
        'Giám sát giao hàng',
      ],

      // Bất động sản
      'Chuyên viên môi giới': [
        'Tư vấn khách',
        'Chốt deal',
        'Marketing BĐS',
        'Dẫn khách',
      ],
      'Quản lý dự án BĐS': [
        'Lập kế hoạch dự án',
        'Pháp lý đất',
        'Tài chính dự án',
        'Quản lý tiến độ',
      ],
      'Tư vấn BĐS': [
        'Nắm bắt thị trường',
        'Kỹ năng thuyết phục',
        'Hợp đồng BĐS',
        'Chăm sóc khách hàng',
      ],
      'Thẩm định giá': [
        'Định giá tài sản',
        'Khảo sát thực địa',
        'Báo cáo định giá',
        'Phân tích thị trường',
      ],

      // Du lịch - Khách sạn
      'Lễ tân khách sạn': [
        'Check-in/out',
        'Sử dụng phần mềm khách sạn',
        'Tiếng Anh giao tiếp',
        'Giao tiếp khách hàng',
      ],
      'Hướng dẫn viên': [
        'Lên lịch trình',
        'Thuyết minh điểm đến',
        'Giải quyết sự cố',
        'Kỹ năng kể chuyện',
      ],
      'Quản lý nhà hàng': [
        'Điều hành hoạt động',
        'Kiểm tra chất lượng',
        'Quản lý nhân sự',
        'Quản lý chi phí',
      ],
      'Đặt phòng - Booking': [
        'Hệ thống booking',
        'Tư vấn khách',
        'Xác nhận đơn',
        'Quản lý tồn phòng',
      ],

      // Thiết kế - Mỹ thuật
      'Thiết kế đồ họa': [
        'Photoshop',
        'Illustrator',
        'Figma',
        'Thiết kế banner',
      ],
      'Thiết kế nội thất': [
        'SketchUp',
        '3Ds Max',
        'AutoCAD',
        'Thuyết trình ý tưởng',
      ],
      'Thiết kế thời trang': [
        'Phác thảo mẫu',
        'May mẫu',
        'Chọn chất liệu',
        'Phối màu',
      ],
      'Chỉnh sửa video': [
        'Adobe Premiere',
        'After Effects',
        'Cut & Trim',
        'Motion Graphic',
      ],
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

  async paginate(
    page: number,
    limit: number,
    query: { search?: string; majorId?: number },
  ) {
    const where: any = {};
    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }
    if (query.majorId) {
      where.major = { id: query.majorId };
    }
    console.log('where', where);
    const [items, total] = await this.skillRepository.findAndCount({
      where,
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
