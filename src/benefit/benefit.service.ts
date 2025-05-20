import { Injectable } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Benefit } from './entities/benefit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BenefitService {
  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepo: Repository<Benefit>,
  ) {}
  async createDefaultBenefits() {
    const defaultBenefits = [
      {
        id: 'healthcare',
        name: 'Bảo hiểm y tế',
        description: 'Cung cấp bảo hiểm sức khỏe toàn diện cho nhân viên',
        icon: 'heart',
      },
      {
        id: 'remote',
        name: 'Làm việc từ xa',
        description: 'Linh hoạt làm việc tại nhà hoặc bất cứ đâu',
        icon: 'laptop',
      },
      {
        id: 'bonus',
        name: 'Thưởng tháng 13',
        description: 'Thưởng lương tháng 13 hoặc theo hiệu suất',
        icon: 'gift',
      },
      {
        id: 'flexible',
        name: 'Giờ giấc linh hoạt',
        description: 'Không giới hạn giờ làm việc, miễn hoàn thành công việc',
        icon: 'clock',
      },
      {
        id: 'training',
        name: 'Đào tạo & phát triển',
        description: 'Cơ hội học tập, phát triển kỹ năng nghề nghiệp',
        icon: 'graduation-cap',
      },
      {
        id: 'team-building',
        name: 'Team Building',
        description: 'Du lịch, dã ngoại, hoạt động đội nhóm định kỳ',
        icon: 'users',
      },
      {
        id: 'meal',
        name: 'Hỗ trợ ăn trưa',
        description: 'Cung cấp suất ăn hoặc trợ cấp ăn uống hằng ngày',
        icon: 'pizza',
      },
      {
        id: 'parking',
        name: 'Chỗ gửi xe',
        description: 'Miễn phí hoặc hỗ trợ phí gửi xe tại công ty',
        icon: 'bike',
      },
      {
        id: 'salary-review',
        name: 'Xét tăng lương định kỳ',
        description: 'Xem xét tăng lương theo định kỳ hoặc hiệu quả làm việc',
        icon: 'trending-up',
      },
    ];

    await this.benefitRepo.save(defaultBenefits);
  }

  create(createBenefitDto: CreateBenefitDto) {
    return 'This action adds a new benefit';
  }

  findAll() {
    return this.benefitRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} benefit`;
  }

  update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return `This action updates a #${id} benefit`;
  }

  remove(id: number) {
    return `This action removes a #${id} benefit`;
  }
}
