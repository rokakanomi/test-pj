import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';
import { msalInstance } from './msalConfig';
import App from './App';

// MSALのモック
jest.mock('@azure/msal-react', () => {
  const actual = jest.requireActual('@azure/msal-react');
  return {
    ...actual,
    useMsal: () => ({
      instance: {
        loginPopup: jest.fn().mockResolvedValue({ account: { username: 'testuser@example.com' } }),
        acquireTokenSilent: jest.fn().mockResolvedValue({ accessToken: 'dummy-access-token' }),
        acquireTokenPopup: jest.fn().mockResolvedValue({ accessToken: 'dummy-access-token' }),
        logoutPopup: jest.fn(),
      },
    }),
    useIsAuthenticated: jest.fn(),
  };
});
const mockedUseIsAuthenticated = useIsAuthenticated as jest.Mock;

jest.mock('./msalConfig', () => ({
  msalInstance: {
    loginPopup: jest.fn().mockResolvedValue({ account: { username: 'testuser@example.com' } }),
    acquireTokenSilent: jest.fn().mockResolvedValue({ accessToken: 'dummy-access-token' }),
    acquireTokenPopup: jest.fn().mockResolvedValue({ accessToken: 'dummy-access-token' }),
    logoutPopup: jest.fn(),
    getLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      verbose: jest.fn(),
      warning: jest.fn(),
      clone: jest.fn().mockReturnThis(),
    }),
    initializeWrapperLibrary: jest.fn(),
    addEventCallback: jest.fn(),
    initialize: jest.fn().mockResolvedValue(undefined),
  },
}));

// fetchのグローバルモック
beforeAll(() => {
  globalThis.fetch = jest.fn();
});
afterAll(() => {
  // fetchのモックをリセット
  if (typeof globalThis.fetch === 'function' && 'mockReset' in globalThis.fetch) {
    (globalThis.fetch as jest.Mock).mockReset();
  }
});

describe('App', () => {
  it('ログインボタンが表示される', () => {
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    expect(screen.getByText('Microsoft 365でログイン')).toBeInTheDocument();
  });

  it('ログイン後にユーザー情報・アクセストークンが表示される', async () => {
    // useIsAuthenticatedをtrueにモック
    mockedUseIsAuthenticated.mockReturnValue(true);
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    // ログイン済み表示
    expect(screen.getByText(/ログイン済み/)).toBeInTheDocument();
    // アクセストークン表示
    await waitFor(() => {
      expect(screen.getByText(/アクセストークン/)).toBeInTheDocument();
    });
  });

  it('RBAC: Adminロールで管理者メニューが表示される', async () => {
    // 初期は未認証
    mockedUseIsAuthenticated.mockReturnValue(false);
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobTitle: 'Admin', displayName: '管理者ユーザー' }),
    });
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    // ログインボタンをクリック
    const loginButton = screen.getByText('Microsoft 365でログイン');
    await fireEvent.click(loginButton);
    // 認証済みに切り替え
    mockedUseIsAuthenticated.mockReturnValue(true);
    await waitFor(() => {
      expect(screen.getByText(/管理者専用メニュー/)).toBeInTheDocument();
    });
  });

  it('RBAC: 一般ユーザーで管理者メニューが非表示', async () => {
    mockedUseIsAuthenticated.mockReturnValue(false);
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobTitle: 'User', displayName: '一般ユーザー' }),
    });
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    const loginButton = screen.getByText('Microsoft 365でログイン');
    await fireEvent.click(loginButton);
    mockedUseIsAuthenticated.mockReturnValue(true);
    await waitFor(() => {
      const elements = screen.getAllByText(/一般ユーザー/);
      // 一般ユーザー：管理者機能は非表示です のみを検証
      expect(elements.some(el => el.textContent === '一般ユーザー：管理者機能は非表示です')).toBe(true);
    });
  });

  it('ログアウト後に未認証UIに戻る', async () => {
    mockedUseIsAuthenticated.mockReturnValue(true);
    const { rerender } = render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    const logoutButton = screen.getByText('ログアウト');
    await act(async () => {
      await fireEvent.click(logoutButton);
      mockedUseIsAuthenticated.mockReturnValue(false);
      rerender(
        <MsalProvider instance={msalInstance}>
          <App msalInstance={msalInstance} />
        </MsalProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByText('Microsoft 365でログイン')).toBeInTheDocument();
    });
  });

  it('ユーザー情報取得失敗時のエラー表示', async () => {
    mockedUseIsAuthenticated.mockReturnValue(false);
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    const loginButton = screen.getByText('Microsoft 365でログイン');
    await fireEvent.click(loginButton);
    mockedUseIsAuthenticated.mockReturnValue(true);
    await waitFor(() => {
      expect(screen.getByText(/取得できませんでした/)).toBeInTheDocument();
    });
  });

  it('サイレント認証失敗時にacquireTokenPopupが呼ばれる', async () => {
    mockedUseIsAuthenticated.mockReturnValue(false);
    const msal = require('./msalConfig').msalInstance;
    msal.acquireTokenSilent.mockRejectedValueOnce(new Error('interaction_required'));
    msal.acquireTokenPopup.mockResolvedValueOnce({ accessToken: 'dummy-access-token-popup' });
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobTitle: 'Admin', displayName: '管理者ユーザー' })
    });
    const { rerender } = render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    const loginButton = screen.getByText('Microsoft 365でログイン');
    await act(async () => {
      await fireEvent.click(loginButton);
      mockedUseIsAuthenticated.mockReturnValue(true);
      rerender(
        <MsalProvider instance={msalInstance}>
          <App msalInstance={msalInstance} />
        </MsalProvider>
      );
    });
    await waitFor(() => {
      expect(msal.acquireTokenPopup).toHaveBeenCalled();
      expect(screen.getByText(/管理者専用メニュー/)).toBeInTheDocument();
    });
  });

  it('複数ロール: Admin, SuperUser両方許可', async () => {
    mockedUseIsAuthenticated.mockReturnValue(false);
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobTitle: 'SuperUser', displayName: '特権ユーザー' })
    });
    render(
      <MsalProvider instance={msalInstance}>
        <App msalInstance={msalInstance} />
      </MsalProvider>
    );
    const loginButton = screen.getByText('Microsoft 365でログイン');
    await act(async () => {
      await fireEvent.click(loginButton);
      mockedUseIsAuthenticated.mockReturnValue(true);
    });
    await waitFor(() => {
      // SuperUserも管理者メニューが見える
      expect(screen.getByText(/管理者専用メニュー/)).toBeInTheDocument();
    });
  });
});
