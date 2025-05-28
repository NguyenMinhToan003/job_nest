import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { Employer } from '../employer/entities/employer.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}
  async followEmployer(employerId: number, candidateId: number) {
    const follow = await this.followRepository.findOne({
      where: { employer: { id: employerId }, candidate: { id: candidateId } },
    });
    if (follow) {
      throw new BadRequestException('Bạn đã theo dõi nhà tuyển dụng này');
    }
    return this.followRepository.save({
      employer: { id: employerId },
      candidate: { id: candidateId },
      time: new Date(),
    });
  }
  async unfollowEmployer(employerId: number, candidateId: number) {
    const follow = await this.followRepository.findOne({
      where: { employer: { id: employerId }, candidate: { id: candidateId } },
    });
    if (!follow) {
      throw new BadRequestException('Bạn chưa theo dõi nhà tuyển dụng này');
    }
    return this.followRepository.remove(follow);
  }
  async candidateGetAllFollows(candidateId: number): Promise<Employer[]> {
    const follows = await this.followRepository.find({
      where: { candidate: { id: candidateId } },
      relations: {
        employer: true,
      },
      order: {
        time: 'DESC',
      },
    });
    if (!follows || follows.length === 0) {
      throw new BadRequestException('Bạn chưa theo dõi nhà tuyển dụng nào');
    }
    return follows.map((follow) => follow.employer);
  }
  async findOne(where: any) {
    return await this.followRepository.findOne({
      where: where,
    });
  }
}
