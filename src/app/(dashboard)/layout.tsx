"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading && window.location.pathname !== "/login") {
      router.push("/login");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-0 pt-16 md:pt-0">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
