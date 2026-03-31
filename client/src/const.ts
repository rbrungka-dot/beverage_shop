export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Pass optional returnPath to redirect back to a specific page after login.
// returnPath is stored in sessionStorage (not in OAuth state, to preserve SDK compatibility).
export const getLoginUrl = (returnPath?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // Keep state as plain base64(redirectUri) — required by SDK's decodeState()
  const state = btoa(redirectUri);

  // Store returnPath in localStorage so it persists across the OAuth redirect
  if (returnPath && typeof window !== "undefined") {
    localStorage.setItem("oauth_return_path", returnPath);
  }

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
