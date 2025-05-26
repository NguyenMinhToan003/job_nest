import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobService } from 'src/modules/job/job.service';
import { CvService } from 'src/modules/cv/cv.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import { APPLY_JOB_STATUS, JOB_STATUS } from 'src/types/enum';
import dayjs from 'dayjs';

@Injectable()
export class ApplyJobValidatorService {
  constructor(
    private readonly jobService: JobService,
    private readonly cvService: CvService,
    @InjectRepository(ApplyJob)
    private readonly applyJobRepository: Repository<ApplyJob>,
  ) {}

  /**
   * Kiểm tra công việc có tồn tại, chưa hết hạn, đang hoạt động
   */
  async validateJobExistenceOrStatus(jobId: number) {
    const job = await this.jobService.findOne(jobId);
    if (!job || job.isActive === JOB_STATUS.PENDING || job.isShow === 0) {
      throw new NotFoundException('Công việc không tồn tại hoặc đã bị ẩn');
    }
    if (job.expiredAt < new Date()) {
      throw new BadRequestException('Công việc đã hết hạn');
    }
  }

  /**
   * Kiểm tra ứng viên đã từng apply công việc này chưa và có được quyền apply không
   * - Dùng chung cho cả CV cũ và CV mới (trong trường hợp mới thì chưa có cvId)
   */
  async validateApplyJobExistence(
    jobId: number,
    userId: number,
    cvId?: number,
  ) {
    await this.validateJobExistenceOrStatus(jobId);
    const lastApply = await this.applyJobRepository.findOne({
      where: {
        job: { id: jobId },
        cv: { candidate: { id: userId } },
      },
      relations: { cv: { candidate: true } },
      order: { applyTime: 'DESC' },
    });

    if (!lastApply) return;
    console.log('lastApply', lastApply);
    if (
      [
        APPLY_JOB_STATUS.ACCEPTED,
        APPLY_JOB_STATUS.PENDING,
        APPLY_JOB_STATUS.INTERVIEW,
      ].includes(lastApply.status)
    ) {
      throw new BadRequestException(
        'Bạn đã ứng tuyển công việc này rồi, vui lòng chờ phản hồi.',
      );
    }

    if (lastApply.status === APPLY_JOB_STATUS.REJECTED) {
      const retryDate = dayjs(lastApply.applyTime).add(7, 'day');
      if (dayjs().isBefore(retryDate)) {
        throw new BadRequestException(
          `Vui lòng chờ thêm ${retryDate.diff(dayjs(), 'day')} ngày nữa để ứng tuyển lại`,
        );
      }

      // Nếu dùng lại CV cũ đã bị từ chối thì chặn
      if (cvId && lastApply.cv.id === cvId) {
        throw new BadRequestException(
          'CV này đã bị từ chối. Vui lòng sử dụng CV khác.',
        );
      }
    }
  }

  /**
   * Dùng cho gửi CV cũ: check job, check quyền dùng CV, check trạng thái apply
   */
  async validateApplyPermission(jobId: number, userId: number, cvId: number) {
    await this.validateJobExistenceOrStatus(jobId);

    const hasPermission = await this.cvService.findCvByUserIdAndCvId(
      +userId,
      +cvId,
    );
    if (!hasPermission) {
      throw new NotFoundException('Bạn không có quyền sử dụng CV này');
    }

    await this.validateApplyJobExistence(jobId, userId, cvId);
  }
}
