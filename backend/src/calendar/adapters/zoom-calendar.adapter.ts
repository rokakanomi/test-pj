import { Injectable } from '@nestjs/common';
import { UnifiedSchedule } from '../../common/interfaces/schedule.interface';

interface ZoomMeeting {
  id?: string | number;
  topic?: string;
  agenda?: string;
  start_time?: string;
  end_time?: string;
  join_url?: string;
}

@Injectable()
export class ZoomCalendarAdapter {
  toUnified(item: ZoomMeeting): UnifiedSchedule {
    return {
      id: item.id?.toString() || '',
      title: item.topic || '',
      description: item.agenda || '',
      start: new Date(item.start_time ?? ''),
      end: new Date(item.end_time ?? item.start_time ?? ''),
      location: item.join_url || '',
      attendees: [], // Zoom APIで取得できる場合は追加
      source: 'zoom',
      sourceEventId: item.id?.toString() || '',
      updatedAt: new Date(item.start_time ?? ''),
    };
  }
}
