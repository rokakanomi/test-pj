import { Controller, Get, Query, Res } from '@nestjs/common';
import { ZoomOAuthService } from './zoom-oauth.service';
import { Response } from 'express';

@Controller('auth/zoom')
export class ZoomOAuthController {
  constructor(private readonly zoomOAuthService: ZoomOAuthService) {}

  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    const url = this.zoomOAuthService.getAuthUrl(state || '');
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).send('No code');
    const token = await this.zoomOAuthService.getToken(code);
    // TODO: トークンをDBやセッションに保存
    return res.json(token);
  }
}
