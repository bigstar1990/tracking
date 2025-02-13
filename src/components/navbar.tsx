"use client";

import {
  ArrowLeftOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const handleSignOut = () => {
  const { BASE_URL } = process.env;
  signOut({ callbackUrl: BASE_URL || "/" });
};

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isAuthPage = (pathname as string).startsWith("/auth");
  const { role } = session?.user || { role: "" };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "HOME", authenticated: false },
    { href: "/track", label: "TRACK", authenticated: false },
    {
      href: "/admin/shipments",
      label: "SHIPMENTS",
      authenticated: true,
    },
    {
      href: "/admin/stream",
      label: "STREAM",
      authenticated: true,
      roles: ["Admin"],
    },
    {
      href: "/admin/elites",
      label: "ELITES",
      authenticated: true,
      roles: ["Admin"],
    },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={"/"}>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 text-2xl font-bold">
                ShiftTrack
              </span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              !link.authenticated ||
              (status === "authenticated" &&
                (!link?.roles || link?.roles?.includes(role))) ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {status === "unauthenticated" ? (
              !isAuthPage ? (
                <>
                  <Link
                    href={"/auth/signin"}
                    className="px-4 py-2 text-white hover:text-cyan-400 transition-colors"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href={"/auth/signup"}
                    className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-all transform hover:scale-105"
                  >
                    SIGN UP
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={"/"}
                    className="px-4 py-2 text-white hover:text-cyan-400 transition-colors"
                  >
                    <ArrowLeftOutlined className="mr-2" size={20} />
                    Back Home
                  </Link>
                </>
              )
            ) : (
              <div className="relative py-1" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Image
                    src={session?.user.image || "/default-avatar.png"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-white uppercase">
                    {session?.user.name}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <CloseOutlined size={24} />
            ) : (
              <MenuOutlined size={24} />
            )}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-indigo-900/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full pt-20 px-6">
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) =>
                !link.authenticated ||
                (status === "authenticated" &&
                  (!link?.roles || link?.roles?.includes(role))) ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>

            <div className="mt-auto mb-8 flex flex-col space-y-4">
              {status === "unauthenticated" ? (
                !isAuthPage ? (
                  <>
                    <Link
                      href={"/auth/signin"}
                      className="w-full py-3 text-white hover:text-cyan-400 transition-colors"
                    >
                      SIGN IN
                    </Link>
                    <Link
                      href={"/auth/signup"}
                      className="w-full py-3 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-all"
                    >
                      SIGN UP
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/"}
                      className="w-full py-3 text-white hover:text-cyan-400 transition-colors"
                    >
                      BACK HOME
                    </Link>
                  </>
                )
              ) : (
                <button
                  className="w-full py-3 text-white hover:text-cyan-400 transition-colors"
                  onClick={handleSignOut}
                >
                  SIGN OUT
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
