import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { UnifiedSchedule } from '../../common/interfaces/schedule.interface';

interface MicrosoftEvent {
  id: string;
  subject?: string;
  bodyPreview?: string;
  start: { dateTime?: string };
  end: { dateTime?: string };
  location?: { displayName?: string };
  attendees?: { emailAddress?: { address: string; name?: string } }[];
  lastModifiedDateTime?: string;
  createdDateTime?: string;
}

interface MicrosoftEventsResponse {
  value: MicrosoftEvent[];
}

@Injectable()
export class MicrosoftCalendarClient {
  private readonly baseUrl = 'https://graph.microsoft.com/v1.0';
  private readonly logger = new Logger(MicrosoftCalendarClient.name);

  async fetchSchedules(token: string): Promise<UnifiedSchedule[]> {
    try {
      const res: AxiosResponse<MicrosoftEventsResponse> = await axios.get(
        `${this.baseUrl}/me/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            $orderby: 'start/dateTime',
            $top: 50,
          },
        },
      );
      const data = res.data;
      return (data.value || []).map(
        (item): UnifiedSchedule => ({
          id: item.id,
          title: item.subject || '',
          description: item.bodyPreview || '',
          start: new Date(item.start?.dateTime ?? ''),
          end: new Date(item.end?.dateTime ?? ''),
          location: item.location?.displayName || '',
          attendees: (item.attendees || []).map((a) => ({
            email: a.emailAddress?.address ?? '',
            displayName: a.emailAddress?.name,
          })),
          source: 'microsoft',
          sourceEventId: item.id,
          updatedAt: new Date(item.lastModifiedDateTime ?? item.createdDateTime ?? ''),
        }),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('MicrosoftカレンダーAPI取得エラー', message);
      throw new Error('MicrosoftカレンダーAPI取得に失敗しました');
    }
  }
}
