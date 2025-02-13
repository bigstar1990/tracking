import type { Metadata } from "next";
import { Provider } from "./provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import "../jobs/index";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwiftTrack",
  description: "The world most reliable and rapid shipment track system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
            {/* Navigation */}
            <Navbar />
            {children}
          </div>
        </body>
      </Provider>
    </html>
  );
}
