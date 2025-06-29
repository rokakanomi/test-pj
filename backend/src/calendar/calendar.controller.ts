import { Controller, Get, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ScheduleEntity } from './schedule.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('sync')
  async syncAll() {
    // 各サービスのスケジュールを同期
    return { message: '同期処理（仮）' };
  }

  @Get('schedules')
  async getSchedules(): Promise<ScheduleEntity[]> {
    return this.calendarService.findAll();
  }

  @Post('schedules')
  async createSchedule(@Body() body: Partial<ScheduleEntity>): Promise<ScheduleEntity> {
    return this.calendarService.create(body);
  }
}
