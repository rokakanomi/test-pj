import { Controller, Get, Query, Res } from '@nestjs/common';
import { MicrosoftOAuthService } from './microsoft-oauth.service';
import { Response } from 'express';

@Controller('auth/microsoft')
export class MicrosoftOAuthController {
  constructor(private readonly msOAuthService: MicrosoftOAuthService) {}

  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    const url = this.msOAuthService.getAuthUrl(state || '');
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).send('No code');
    const token = await this.msOAuthService.getToken(code);
    // TODO: トークンをDBやセッションに保存
    return res.json(token);
  }
}
