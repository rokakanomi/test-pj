import { DataSource } from 'typeorm';
import { ScheduleEntity } from './src/calendar/schedule.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'schedule.sqlite',
  synchronize: true,
  logging: false,
  entities: [ScheduleEntity],
});
