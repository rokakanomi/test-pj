import { PublicClientApplication } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || ''}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
