import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo = "/login") {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
}

export function useLogout(redirectTo = "/login") {
  const router = useRouter();
  return () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push(redirectTo);
    }
  };
} 