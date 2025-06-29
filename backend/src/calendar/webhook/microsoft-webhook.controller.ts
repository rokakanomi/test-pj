import { Controller, Post, Req, Logger } from '@nestjs/common';
import { Request } from 'express';

@Controller('webhook/microsoft')
export class MicrosoftWebhookController {
  private readonly logger = new Logger(MicrosoftWebhookController.name);

  @Post()
  handleWebhook(@Req() req: Request) {
    // MicrosoftカレンダーのWebhook通知を受信し、イベントデータをログ出力
    const body = req.body;
    this.logger.log('Microsoft Webhook received: ' + JSON.stringify(body));
    // TODO: 必要に応じてUnifiedSchedule変換やDB更新処理を呼び出す
    return { received: true };
  }
}
