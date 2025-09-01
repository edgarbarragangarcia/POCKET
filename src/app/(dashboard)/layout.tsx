"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Comentado temporalmente para permitir acceso al dashboard sin autenticación
  // useEffect(() => {
  //   if (!user && !isLoading && window.location.pathname !== "/login") {
  //     router.push("/login");
  //   }
  // }, [user, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
