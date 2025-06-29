import { Module } from '@nestjs/common';
import { SyncSchedulerService } from './sync-scheduler.service';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [CalendarModule],
  providers: [SyncSchedulerService],
})
export class JobsModule {}
