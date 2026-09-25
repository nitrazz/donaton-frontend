import { Configuration, PopupRequest, LogLevel } from "@azure/msal-browser";

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const frontendClientId = import.meta.env.VITE_AZURE_FRONTEND_CLIENT_ID;
const backendClientId = import.meta.env.VITE_AZURE_BACKEND_CLIENT_ID;

export const msalConfig: Configuration = {
  auth: {
    clientId: frontendClientId || "",
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(`[MSAL Error]: ${message}`);
      },
      logLevel: LogLevel.Error,
    },
  },
};

export const tokenRequest: PopupRequest = {
  scopes: [`api://${backendClientId}/access_as_user`],
};