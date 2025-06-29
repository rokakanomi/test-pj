import { GoogleCalendarClient } from '../../../src/calendar/clients/google-calendar.client';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('GoogleCalendarClient', () => {
  let client: GoogleCalendarClient;
  let mock: MockAdapter;

  beforeAll(() => {
    client = new GoogleCalendarClient();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should fetch and convert Google events to UnifiedSchedule', async () => {
    const fakeResponse = {
      items: [
        {
          id: '1',
          summary: 'Test Event',
          description: 'desc',
          start: { dateTime: '2025-07-01T10:00:00Z' },
          end: { dateTime: '2025-07-01T11:00:00Z' },
          location: 'Tokyo',
          attendees: [{ email: 'a@example.com', displayName: 'A' }],
          updated: '2025-06-28T00:00:00Z',
        },
      ],
    };
    mock.onGet(/googleapis/).reply(200, fakeResponse);
    const result = await client.fetchSchedules('dummy-token');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Event');
    expect(result[0].attendees && result[0].attendees[0]?.email).toBe('a@example.com');
  });
});
