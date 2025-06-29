import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { MicrosoftCalendarClient } from './clients/microsoft-calendar.client';
import { GoogleCalendarClient } from './clients/google-calendar.client';
import { ZoomCalendarClient } from './clients/zoom-calendar.client';
import { MicrosoftCalendarAdapter } from './adapters/microsoft-calendar.adapter';
import { GoogleCalendarAdapter } from './adapters/google-calendar.adapter';
import { ZoomCalendarAdapter } from './adapters/zoom-calendar.adapter';
import { ScheduleEntity } from './schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    MicrosoftCalendarClient,
    GoogleCalendarClient,
    ZoomCalendarClient,
    MicrosoftCalendarAdapter,
    GoogleCalendarAdapter,
    ZoomCalendarAdapter,
  ],
  exports: [CalendarService],
})
export class CalendarModule {}
