import { Injectable } from '@nestjs/common';
import { UnifiedSchedule } from '../../common/interfaces/schedule.interface';

interface GoogleEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  attendees?: { email: string; displayName?: string }[];
  updated?: string;
  created?: string;
}

@Injectable()
export class GoogleCalendarAdapter {
  // Googleカレンダー用のデータ変換処理
  toUnified(item: GoogleEvent): UnifiedSchedule {
    return {
      id: item.id,
      title: item.summary || '',
      description: item.description || '',
      start: new Date(item.start.dateTime ?? item.start.date ?? ''),
      end: new Date(item.end.dateTime ?? item.end.date ?? ''),
      location: item.location || '',
      attendees: (item.attendees || []).map((a) => ({
        email: a.email,
        displayName: a.displayName || '',
      })),
      source: 'google',
      sourceEventId: item.id,
      updatedAt: new Date(item.updated ?? item.created ?? ''),
    };
  }
  // 必要に応じて逆変換も実装可能
}
