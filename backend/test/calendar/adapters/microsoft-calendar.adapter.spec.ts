import { MicrosoftCalendarAdapter } from '../../../src/calendar/adapters/microsoft-calendar.adapter';

describe('MicrosoftCalendarAdapter', () => {
  const adapter = new MicrosoftCalendarAdapter();
  it('should convert Microsoft event to UnifiedSchedule', () => {
    const item = {
      id: '1',
      subject: 'MS',
      start: { dateTime: '2025-07-01T10:00:00Z' },
      end: { dateTime: '2025-07-01T11:00:00Z' },
      lastModifiedDateTime: '2025-06-28T00:00:00Z',
      location: { displayName: 'Tokyo' },
      attendees: [{ emailAddress: { address: 'b@example.com', name: 'B' } }],
    };
    const result = adapter.toUnified(item);
    expect(result.id).toBe('1');
    expect(result.title).toBe('MS');
    expect(result.location).toBe('Tokyo');
  });
});
