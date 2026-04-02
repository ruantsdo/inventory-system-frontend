import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/auth";

const revalidationDebounceInMs = 5000;

export function useSessionRevalidation() {
  const revalidateSession = useAuthStore((state) => state.revalidateSession);
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    const tryRevalidate = () => {
      const now = Date.now();
      if (now - lastCheckRef.current < revalidationDebounceInMs) return;
      lastCheckRef.current = now;
      revalidateSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tryRevalidate();
      }
    };

    const handleWindowFocus = () => {
      tryRevalidate();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [revalidateSession]);
}
