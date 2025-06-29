import { Injectable, Logger } from '@nestjs/common';
import { GoogleCalendarClient } from '../calendar/clients/google-calendar.client';
import { MicrosoftCalendarClient } from '../calendar/clients/microsoft-calendar.client';
import { ZoomCalendarClient } from '../calendar/clients/zoom-calendar.client';
// import { TokenRepository } from '../auth/token.repository'; // 実際はDBやストレージからトークン取得

@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);

  constructor(
    private readonly googleClient: GoogleCalendarClient,
    private readonly microsoftClient: MicrosoftCalendarClient,
    private readonly zoomClient: ZoomCalendarClient,
  ) {}

  // 定期同期バッチのサービス本体

  // サンプル: Googleカレンダーの予定を定期取得
  async syncGoogleSchedules() {
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN || '';
    if (!accessToken) {
      this.logger.warn('Google access token is not set.');
      return;
    }
    const schedules = await this.googleClient.fetchSchedules(accessToken);
    // TODO: 取得した予定をDB保存や他サービス同期など
    this.logger.log(`Google予定同期: ${schedules.length} 件`);
  }

  // サンプル: Microsoftカレンダーの予定を定期取得
  async syncMicrosoftSchedules() {
    const accessToken = process.env.MS_ACCESS_TOKEN || '';
    if (!accessToken) {
      this.logger.warn('Microsoft access token is not set.');
      return;
    }
    const schedules = await this.microsoftClient.fetchSchedules(accessToken);
    // TODO: 取得した予定をDB保存や他サービス同期など
    this.logger.log(`Microsoft予定同期: ${schedules.length} 件`);
  }

  // サンプル: Zoomカレンダーの予定を定期取得
  async syncZoomSchedules() {
    const accessToken = process.env.ZOOM_ACCESS_TOKEN || '';
    if (!accessToken) {
      this.logger.warn('Zoom access token is not set.');
      return;
    }
    const schedules = await this.zoomClient.fetchSchedules(accessToken);
    // TODO: 取得した予定をDB保存や他サービス同期など
    this.logger.log(`Zoom予定同期: ${schedules.length} 件`);
  }
}
