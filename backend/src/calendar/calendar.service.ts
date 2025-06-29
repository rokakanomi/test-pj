import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  // 各APIクライアント・アダプタをDIで受け取る（省略）
  // 統一フォーマットでのスケジュール取得・同期・マージ等のロジックを実装

  async findAll(): Promise<ScheduleEntity[]> {
    return this.scheduleRepo.find();
  }

  async create(schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity> {
    const entity = this.scheduleRepo.create(schedule);
    return this.scheduleRepo.save(entity);
  }
}
