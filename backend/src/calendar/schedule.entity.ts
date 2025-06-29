import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  start!: Date;

  @Column()
  end!: Date;

  @Column({ nullable: true })
  location?: string;

  @Column('simple-json', { nullable: true })
  attendees?: Array<{ email: string; displayName?: string }>;

  @Column()
  source!: string;

  @Column()
  sourceEventId!: string;

  @Column()
  updatedAt!: Date;
}
