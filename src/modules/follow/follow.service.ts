import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { ResumeVersionService } from '../resume-version/resume-version.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly resumeVersionService: ResumeVersionService,
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
  async candidateGetAllFollows(
    candidateId: number,
    page: number,
    limit: number,
  ) {
    const [items, total] = await this.followRepository.findAndCount({
      where: { candidate: { id: candidateId } },
      relations: {
        employer: {
          locations: {
            district: {
              city: true,
            },
          },
          country: true,
        },
      },
      order: {
        time: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    if (total === 0) {
      throw new BadRequestException('Bạn chưa theo dõi nhà tuyển dụng nào');
    }
    const totalPage = Math.ceil(total / limit);
    return {
      items,
      total,
      page,
      totalPage,
    };
  }
  async findOne(where: any) {
    return await this.followRepository.findOne({
      where: where,
    });
  }

  async getRecommendedFollows(candidateId: number) {
    const getResumeVersions =
      await this.resumeVersionService.getActiveDefaultResume(candidateId);
    const listFollow = await this.followRepository.find({
      where: { candidate: { id: candidateId } },
      relations: {
        employer: true,
      },
    });
    const listSkills = getResumeVersions.skills.map((skill) => skill.id);
    const listIdsFollowed = listFollow.map((follow) => follow.employer.id);
    console.log('listSkills', listSkills);
    console.log('listIdsFollowed', listIdsFollowed);
    const listJob = await this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.employer', 'employer')
      .leftJoinAndSelect('employer.jobs', 'job')
      .leftJoinAndSelect('job.skills', 'skill')
      .leftJoinAndSelect('job.locations', 'location')
      .leftJoinAndSelect('location.district', 'district')
      .leftJoinAndSelect('district.city', 'city')
      .leftJoinAndSelect('job.levels', 'level')
      .leftJoinAndSelect('job.education', 'education')
      .leftJoinAndSelect('job.typeJobs', 'typeJob')
      .where('follow.candidate.id = :candidateId', { candidateId })
      .andWhere('employer.id IN (:...ids)', { ids: listIdsFollowed })
      .andWhere('skill.id IN (:...skills)', { skills: listSkills })
      .andWhere('job.isActive = true')
      .getMany();

    const employer = listJob.map((item) => item.employer);
    return employer;
  }
}
