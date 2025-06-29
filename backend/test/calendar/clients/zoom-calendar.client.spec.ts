import { ZoomCalendarClient } from '../../../src/calendar/clients/zoom-calendar.client';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ZoomCalendarClient', () => {
  let client: ZoomCalendarClient;
  let mock: MockAdapter;

  beforeAll(() => {
    client = new ZoomCalendarClient();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should fetch and convert Zoom meetings to UnifiedSchedule', async () => {
    const fakeResponse = {
      meetings: [
        {
          id: 123,
          topic: 'Zoom Meeting',
          agenda: 'desc',
          start_time: '2025-07-01T10:00:00Z',
          end_time: '2025-07-01T11:00:00Z',
          join_url: 'https://zoom.us/j/123',
        },
      ],
    };
    mock.onGet(/api.zoom.us/).reply(200, fakeResponse);
    const result = await client.fetchSchedules('dummy-token');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Zoom Meeting');
    expect(result[0].location).toContain('zoom.us');
  });
});
