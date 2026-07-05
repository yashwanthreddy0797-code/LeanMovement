import { useCallback, useEffect, useState } from "react";

export function useSidebarCollapse(storageKey: string) {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(storageKey) === "true");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle, ready };
}
