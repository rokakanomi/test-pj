import { SyncSchedulerService } from '../../src/jobs/sync-scheduler.service';
import { GoogleCalendarClient } from '../../src/calendar/clients/google-calendar.client';
import { MicrosoftCalendarClient } from '../../src/calendar/clients/microsoft-calendar.client';
import { ZoomCalendarClient } from '../../src/calendar/clients/zoom-calendar.client';

jest.mock('../../src/calendar/clients/google-calendar.client');
jest.mock('../../src/calendar/clients/microsoft-calendar.client');
jest.mock('../../src/calendar/clients/zoom-calendar.client');

describe('SyncSchedulerService', () => {
  let service: SyncSchedulerService;
  let googleClient: jest.Mocked<GoogleCalendarClient>;
  let msClient: jest.Mocked<MicrosoftCalendarClient>;
  let zoomClient: jest.Mocked<ZoomCalendarClient>;

  beforeEach(() => {
    process.env.GOOGLE_ACCESS_TOKEN = 'dummy';
    process.env.MS_ACCESS_TOKEN = 'dummy';
    process.env.ZOOM_ACCESS_TOKEN = 'dummy';
    googleClient = new GoogleCalendarClient() as any;
    msClient = new MicrosoftCalendarClient() as any;
    zoomClient = new ZoomCalendarClient() as any;
    service = new SyncSchedulerService(googleClient, msClient, zoomClient);
  });

  it('should call fetchSchedules for Google', async () => {
    googleClient.fetchSchedules.mockResolvedValueOnce([]);
    await service.syncGoogleSchedules();
    expect(googleClient.fetchSchedules).toHaveBeenCalled();
  });

  it('should call fetchSchedules for Microsoft', async () => {
    msClient.fetchSchedules.mockResolvedValueOnce([]);
    await service.syncMicrosoftSchedules();
    expect(msClient.fetchSchedules).toHaveBeenCalled();
  });

  it('should call fetchSchedules for Zoom', async () => {
    zoomClient.fetchSchedules.mockResolvedValueOnce([]);
    await service.syncZoomSchedules();
    expect(zoomClient.fetchSchedules).toHaveBeenCalled();
  });
});
