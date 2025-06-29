import { ZoomCalendarAdapter } from '../../../src/calendar/adapters/zoom-calendar.adapter';

describe('ZoomCalendarAdapter', () => {
  const adapter = new ZoomCalendarAdapter();
  it('should convert Zoom meeting to UnifiedSchedule', () => {
    const item = {
      id: 123,
      topic: 'Zoom',
      start_time: '2025-07-01T10:00:00Z',
      end_time: '2025-07-01T11:00:00Z',
      join_url: 'https://zoom.us/j/123',
    };
    const result = adapter.toUnified(item);
    expect(result.id).toBe('123');
    expect(result.title).toBe('Zoom');
    expect(result.location).toContain('zoom.us');
  });
});
