import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarModule } from './calendar/calendar.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleEntity } from './calendar/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'schedule.sqlite',
      entities: [ScheduleEntity],
      synchronize: true,
    }),
    CalendarModule,
    AuthModule,
    JobsModule,
  ],
})
export class AppModule {}
