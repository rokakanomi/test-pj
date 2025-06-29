import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import type { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { useState } from 'react'
import './App.css'

// ユーザー情報の型定義
interface UserInfo {
  jobTitle?: string;
  displayName?: string;
  [key: string]: unknown;
}

// Appコンポーネントのprops型
interface AppProps {
  msalInstance?: IPublicClientApplication;
}

// RBAC用のロール判定関数
function hasRole(userInfo: UserInfo | null, allowedRoles: string[]): boolean {
  if (!userInfo) return false;
  // jobTitleがカンマ区切りや配列の場合も考慮
  const jobTitles = typeof userInfo.jobTitle === 'string'
    ? userInfo.jobTitle.split(',').map(j => j.trim())
    : Array.isArray(userInfo.jobTitle)
      ? userInfo.jobTitle
      : [];
  return allowedRoles.some(role => jobTitles.includes(role));
}

function App({ msalInstance }: AppProps) {
  const msalContext = useMsal();
  const instance = msalInstance || msalContext.instance;
  const isAuthenticated = useIsAuthenticated();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ['User.Read'],
      });
      setUser(loginResponse.account || null);
      // アクセストークン取得
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: loginResponse.account,
        });
        setAccessToken(tokenResponse.accessToken);
        fetchUserInfo(tokenResponse.accessToken);
      } catch (e: any) {
        // サイレント失敗時はポップアップで再認証
        const msg = e?.message || e?.errorMessage || '';
        const code = e?.errorCode || '';
        if (
          msg.includes('interaction_required') ||
          code === 'interaction_required' ||
          msg.includes('consent_required') ||
          code === 'consent_required' ||
          msg.includes('login_required') ||
          code === 'login_required'
        ) {
          const tokenResponse = await instance.acquireTokenPopup({
            scopes: ['User.Read'],
          });
          setAccessToken(tokenResponse.accessToken);
          fetchUserInfo(tokenResponse.accessToken);
        } else {
          setAccessToken(null);
          setUserInfo(null);
        }
      }
    } catch (e) {
      setAccessToken(null);
      setUserInfo(null);
    }
  };

  const fetchUserInfo = async (token: string) => {
    const res = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUserInfo(await res.json());
    } else {
      setUserInfo(null);
    }
  };

  const logout = () => {
    instance.logoutPopup();
    setAccessToken(null);
    setUser(null);
    setUserInfo(null);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        {!isAuthenticated ? (
          <button onClick={login}>Microsoft 365でログイン</button>
        ) : (
          <>
            <div>ログイン済み: {user?.username}</div>
            <button onClick={logout}>ログアウト</button>
            <div>
              <strong>アクセストークン:</strong>
              <pre style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{accessToken}</pre>
            </div>
            <div>
              <strong>ユーザー情報:</strong>
              <pre style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{userInfo ? JSON.stringify(userInfo, null, 2) : '取得できませんでした'}</pre>
            </div>
            {/* RBAC例: Admin, SuperUser両方許可 */}
            {userInfo && hasRole(userInfo, ['Admin', 'SuperUser']) && (
              <div style={{ color: 'green', fontWeight: 'bold' }}>
                管理者専用メニュー：ここに管理者向け機能を実装
              </div>
            )}
            {userInfo && !hasRole(userInfo, ['Admin', 'SuperUser']) && (
              <div style={{ color: 'gray' }}>
                一般ユーザー：管理者機能は非表示です
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default App
