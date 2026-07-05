import { useEffect, useState } from "react";

export type PortalRole = "client" | "coach";
export type PortalUser = {
  id?: string;
  email: string;
  name: string;
  role: PortalRole;
};

const KEY = "apex_portal_user";

export function getPortalUser(): PortalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PortalUser) : null;
  } catch {
    return null;
  }
}

export function setPortalUser(u: PortalUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("portal-auth"));
}

/** @deprecated Use usePortalSession() instead */
export function usePortalUser() {
  const [user, setUser] = useState<PortalUser | null>(null);
  useEffect(() => {
    setUser(getPortalUser());
    const handler = () => setUser(getPortalUser());
    window.addEventListener("portal-auth", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("portal-auth", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return user;
}
