"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Define the type for the props
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
