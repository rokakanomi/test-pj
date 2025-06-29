import { Module } from '@nestjs/common';
import { MicrosoftOAuthService } from './oauth/microsoft-oauth.service';
import { GoogleOAuthService } from './oauth/google-oauth.service';
import { ZoomOAuthService } from './oauth/zoom-oauth.service';
import { GoogleOAuthController } from './oauth/google-oauth.controller';
import { MicrosoftOAuthController } from './oauth/microsoft-oauth.controller';
import { ZoomOAuthController } from './oauth/zoom-oauth.controller';

@Module({
  providers: [MicrosoftOAuthService, GoogleOAuthService, ZoomOAuthService],
  controllers: [GoogleOAuthController, MicrosoftOAuthController, ZoomOAuthController],
  exports: [MicrosoftOAuthService, GoogleOAuthService, ZoomOAuthService],
})
export class AuthModule {}
