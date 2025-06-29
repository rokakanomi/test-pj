import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { UnifiedSchedule } from '../../common/interfaces/schedule.interface';

interface ZoomMeeting {
  id?: string | number;
  topic?: string;
  agenda?: string;
  start_time?: string;
  end_time?: string;
  join_url?: string;
}

interface ZoomMeetingsResponse {
  meetings: ZoomMeeting[];
}

@Injectable()
export class ZoomCalendarClient {
  private readonly baseUrl = 'https://api.zoom.us/v2';
  private readonly logger = new Logger(ZoomCalendarClient.name);

  async fetchSchedules(token: string): Promise<UnifiedSchedule[]> {
    try {
      const res: AxiosResponse<ZoomMeetingsResponse> = await axios.get(
        `${this.baseUrl}/users/me/meetings`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            type: 'upcoming',
            page_size: 30,
          },
        },
      );
      const data = res.data;
      return (data.meetings || []).map(
        (item): UnifiedSchedule => ({
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
        }),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('ZoomカレンダーAPI取得エラー', message);
      throw new Error('ZoomカレンダーAPI取得に失敗しました');
    }
  }
}
