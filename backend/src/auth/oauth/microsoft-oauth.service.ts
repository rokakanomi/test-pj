import { Injectable } from '@nestjs/common';
import axios from 'axios';

const MS_CLIENT_ID = process.env.MS_CLIENT_ID || '';
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET || '';
const MS_REDIRECT_URI = process.env.MS_REDIRECT_URI || '';

export interface MicrosoftTokenResponse {
  token_type: string;
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
  refresh_token?: string;
  id_token?: string;
}

@Injectable()
export class MicrosoftOAuthService {
  getAuthUrl(state: string): string {
    const base = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
    const params = new URLSearchParams({
      client_id: MS_CLIENT_ID,
      response_type: 'code',
      redirect_uri: MS_REDIRECT_URI,
      response_mode: 'query',
      scope: 'https://graph.microsoft.com/Calendars.Read offline_access',
      state,
    });
    return `${base}?${params.toString()}`;
  }

  async getToken(code: string): Promise<MicrosoftTokenResponse> {
    const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const params = new URLSearchParams({
      client_id: MS_CLIENT_ID,
      client_secret: MS_CLIENT_SECRET,
      code,
      redirect_uri: MS_REDIRECT_URI,
      grant_type: 'authorization_code',
      scope: 'https://graph.microsoft.com/Calendars.Read offline_access',
    });
    const res = await axios.post<MicrosoftTokenResponse>(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  }
}
