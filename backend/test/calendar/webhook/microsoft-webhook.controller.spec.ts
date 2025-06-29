import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftWebhookController } from '../../../src/calendar/webhook/microsoft-webhook.controller';
import { Request } from 'express';

describe('MicrosoftWebhookController', () => {
  let controller: MicrosoftWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicrosoftWebhookController],
    }).compile();
    controller = module.get<MicrosoftWebhookController>(MicrosoftWebhookController);
  });

  it('should return received true', () => {
    const req = { body: { test: 'data' } } as Request;
    const result = controller.handleWebhook(req);
    expect(result).toEqual({ received: true });
  });
});
