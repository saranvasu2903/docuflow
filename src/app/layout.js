// RootLayout.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { Header } from "@/components/Dashboard/Header";
import { Sidebar } from "@/components/Dashboard/Sidebar";

import QueryProvider from "@/components/QueryProvider";
import AuthGuard from "@/components/AuthGuard";
import UserSyncProvider from "@/components/UserSyncProvider";

import { Provider } from "react-redux";
import { store } from "@/store";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const publicRoutes = ["/", "/sign-in", "/sign-up", "/onboarding", "/subscription"];

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = publicRoutes.includes(pathname);

  return (
    <ClerkProvider
      navigate={to => router.push(to)}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/"
    >
      <html lang="en" data-theme="light">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f4f1eb]`}>
          <Provider store={store}>
            <QueryProvider>
              <AuthGuard>
                <UserSyncProvider />
                
                {isPublic ? (
                  <div className="min-h-screen flex items-center justify-center">
                    {children}
                  </div>
                ) : (
                  <div className="flex h-screen">
                    <Sidebar className="w-20 h-full fixed left-0 top-0" />

                    <div className="flex-1 flex flex-col ml-20">

                      <Header className="h-16 flex-shrink-0" />

                      <main className="flex-1 overflow-y-auto bg-white rounded-2xl mr-4 mb-4">
                        <Toaster position="bottom-right" reverseOrder={false} />
                        {children}
                      </main>
                    </div>
                  </div>
                )}
              </AuthGuard>
            </QueryProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}