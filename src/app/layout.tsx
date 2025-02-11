"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/src/css/satoshi.css";
import "@/src/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/src/components/common/Loader";
import { Provider } from "@/src/Provider";
import { ManagerProvider } from "../context/ManagerContext";
import { SearchProvider } from "../context/SearchContext";
import { NotificationProvider } from "../context/NotificationContext";
import Notifications from "../notification/Notifications";
import { CandidateProvider } from "../context/CandidateContext";
import { CandidatesProvider } from "../context/CandidatesContext";
import { Toaster } from "@/components/ui/toaster"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="ru">
      <body suppressHydrationWarning={true}>
      <Provider>
      <NotificationProvider>
      <Notifications />
        <SearchProvider>
        <ManagerProvider>
          <CandidatesProvider>
          <CandidateProvider>
        <div className="text-black dark:text-white dark:bg-boxdark-2   ">
          {loading ? <Loader /> : children}
        </div>
        </CandidateProvider>
        </CandidatesProvider>
        </ManagerProvider>
        </SearchProvider>
        </NotificationProvider>
        </Provider>
      </body>
    </html>
  );
}
