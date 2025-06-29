// スケジュールデータの統一インターフェース
export interface UnifiedSchedule {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  source: 'google' | 'microsoft' | 'zoom';
  sourceEventId: string;
  updatedAt: Date;
}
