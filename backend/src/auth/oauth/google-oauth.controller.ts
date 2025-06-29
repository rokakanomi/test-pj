import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleOAuthService } from './google-oauth.service';
import { Response } from 'express';

@Controller('auth/google')
export class GoogleOAuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    const url = this.googleOAuthService.getAuthUrl(state || '');
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).send('No code');
    const token = await this.googleOAuthService.getToken(code);
    // TODO: トークンをDBやセッションに保存
    return res.json(token);
  }
}
