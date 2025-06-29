import { Injectable } from '@nestjs/common';
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

@Injectable()
export class MicrosoftCalendarAdapter {
  // Microsoftカレンダー用のデータ変換処理
  toUnified(item: MicrosoftEvent): UnifiedSchedule {
    return {
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
    };
  }
}
