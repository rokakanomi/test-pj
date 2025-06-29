import { MicrosoftCalendarClient } from '../../../src/calendar/clients/microsoft-calendar.client';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('MicrosoftCalendarClient', () => {
  let client: MicrosoftCalendarClient;
  let mock: MockAdapter;

  beforeAll(() => {
    client = new MicrosoftCalendarClient();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should fetch and convert Microsoft events to UnifiedSchedule', async () => {
    const fakeResponse = {
      value: [
        {
          id: '1',
          subject: 'MS Event',
          bodyPreview: 'desc',
          start: { dateTime: '2025-07-01T10:00:00Z' },
          end: { dateTime: '2025-07-01T11:00:00Z' },
          location: { displayName: 'Osaka' },
          attendees: [{ emailAddress: { address: 'b@example.com', name: 'B' } }],
          lastModifiedDateTime: '2025-06-28T00:00:00Z',
        },
      ],
    };
    mock.onGet(/graph.microsoft.com/).reply(200, fakeResponse);
    const result = await client.fetchSchedules('dummy-token');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('MS Event');
    expect(result[0].attendees && result[0].attendees[0]?.email).toBe('b@example.com');
  });
});
