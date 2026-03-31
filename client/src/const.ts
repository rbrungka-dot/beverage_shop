export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Pass optional returnPath to redirect back to a specific page after login.
// returnPath is embedded in the redirectUri as a query param so the server can redirect after OAuth.
export const getLoginUrl = (returnPath?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  // Embed returnPath in the callback URL so the server can redirect there after login
  const callbackBase = `${window.location.origin}/api/oauth/callback`;
  const redirectUri = returnPath
    ? `${callbackBase}?returnPath=${encodeURIComponent(returnPath)}`
    : callbackBase;
  // state must be btoa(redirectUri) — required by SDK's decodeState()
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
