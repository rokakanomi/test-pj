import { GoogleCalendarAdapter } from '../../../src/calendar/adapters/google-calendar.adapter';

describe('GoogleCalendarAdapter', () => {
  const adapter = new GoogleCalendarAdapter();
  it('should convert Google event to UnifiedSchedule', () => {
    const item = {
      id: '1',
      summary: 'Test',
      start: { dateTime: '2025-07-01T10:00:00Z' },
      end: { dateTime: '2025-07-01T11:00:00Z' },
      updated: '2025-06-28T00:00:00Z',
    };
    const result = adapter.toUnified(item);
    expect(result.id).toBe('1');
    expect(result.title).toBe('Test');
    expect(result.start.toISOString()).toBe('2025-07-01T10:00:00.000Z');
  });
});
