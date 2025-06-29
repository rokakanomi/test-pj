import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
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

interface GoogleEventsResponse {
  items: GoogleEvent[];
}

@Injectable()
export class GoogleCalendarClient {
  private readonly baseUrl = 'https://www.googleapis.com/calendar/v3';
  private readonly logger = new Logger(GoogleCalendarClient.name);

  async fetchSchedules(token: string): Promise<UnifiedSchedule[]> {
    try {
      const res: AxiosResponse<GoogleEventsResponse> = await axios.get(
        `${this.baseUrl}/calendars/primary/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            singleEvents: true,
            orderBy: 'startTime',
            timeMin: new Date().toISOString(),
          },
        },
      );
      const data = res.data;
      // Googleイベント→統一フォーマット変換
      return (data.items || []).map(
        (item): UnifiedSchedule => ({
          id: item.id,
          title: item.summary || '',
          description: item.description || '',
          start: new Date(item.start.dateTime ?? item.start.date ?? ''),
          end: new Date(item.end.dateTime ?? item.end.date ?? ''),
          location: item.location || '',
          attendees: (item.attendees || []).map((a) => ({
            email: a.email,
            displayName: a.displayName,
          })),
          source: 'google',
          sourceEventId: item.id,
          updatedAt: new Date(item.updated ?? item.created ?? ''),
        }),
      );
    } catch (error) {
      this.logger.error('GoogleカレンダーAPI取得エラー', (error as Error)?.message ?? error);
      throw new Error('GoogleカレンダーAPI取得に失敗しました');
    }
  }
}
