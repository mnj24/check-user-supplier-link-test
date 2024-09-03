"use client"; // This file should be treated as a client component

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import React from "react";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "57f46a96-59bc-4016-b80e-81f0358865ee", // Replace with your actual client ID
    authority: "https://login.microsoftonline.com/manomanoj20outlook.onmicrosoft.com", // Replace with your actual tenant ID
    redirectUri: "https://witty-sand-04e15040f.5.azurestaticapps.net", // Replace with your actual redirect URI
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

interface MsalProviderWrapperProps {
  children: React.ReactNode;
}

const MsalProviderWrapper: React.FC<MsalProviderWrapperProps> = ({ children }) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default MsalProviderWrapper;
