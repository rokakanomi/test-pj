import { Test, TestingModule } from '@nestjs/testing';
import { GoogleWebhookController } from '../../../src/calendar/webhook/google-webhook.controller';
import { Request } from 'express';

describe('GoogleWebhookController', () => {
  let controller: GoogleWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleWebhookController],
    }).compile();
    controller = module.get<GoogleWebhookController>(GoogleWebhookController);
  });

  it('should return received true', () => {
    const req = { body: { test: 'data' } } as Request;
    const result = controller.handleWebhook(req);
    expect(result).toEqual({ received: true });
  });
});
