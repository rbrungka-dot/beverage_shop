export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Pass optional returnPath to redirect back to a specific page after login.
// returnPath is stored in localStorage before redirecting; App.tsx reads it after OAuth returns.
export const getLoginUrl = (returnPath?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;

  // Encode returnPath into state so server can redirect back after OAuth
  // SDK decodeState() does atob(state) and uses it as redirectUri,
  // so we encode a JSON object that contains both redirectUri and returnPath.
  // The server's decodeState() will parse this JSON and extract both fields.
  const statePayload = returnPath && returnPath !== "/"
    ? JSON.stringify({ redirectUri, returnPath })
    : redirectUri; // backward compat: plain string for no returnPath
  const state = btoa(statePayload);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
