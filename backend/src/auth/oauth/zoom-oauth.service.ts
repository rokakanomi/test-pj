import { Injectable } from '@nestjs/common';
import axios from 'axios';

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID || '';
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET || '';
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI || '';

export interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
}

@Injectable()
export class ZoomOAuthService {
  getAuthUrl(state: string): string {
    const base = 'https://zoom.us/oauth/authorize';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: ZOOM_CLIENT_ID,
      redirect_uri: ZOOM_REDIRECT_URI,
      state,
    });
    return `${base}?${params.toString()}`;
  }

  async getToken(code: string): Promise<ZoomTokenResponse> {
    const url = 'https://zoom.us/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: ZOOM_REDIRECT_URI,
    });
    const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
    const res = await axios.post<ZoomTokenResponse>(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    });
    return res.data;
  }
}
