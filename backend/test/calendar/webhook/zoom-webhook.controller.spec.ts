import { Test, TestingModule } from '@nestjs/testing';
import { ZoomWebhookController } from '../../../src/calendar/webhook/zoom-webhook.controller';
import { Request } from 'express';

describe('ZoomWebhookController', () => {
  let controller: ZoomWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoomWebhookController],
    }).compile();
    controller = module.get<ZoomWebhookController>(ZoomWebhookController);
  });

  it('should return received true', () => {
    const req = { body: { test: 'data' } } as Request;
    const result = controller.handleWebhook(req);
    expect(result).toEqual({ received: true });
  });
});
