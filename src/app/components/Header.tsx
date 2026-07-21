"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface HeaderProps {
  initialRole?: "business" | "candidate" | null;
  /** Custom navigation links to override default role-based links */
  navLinks?: Array<{ href: string; label: string }>;
  /** Custom React nodes to render inside the central navigation slot (e.g. tabs) */
  customNav?: React.ReactNode;
  /** Custom right-hand action controls (e.g., Profile, Mail, Invitations, SignOut) */
  rightActions?: React.ReactNode;
  /** Additional elements to display beside the logo (e.g., Welcome message) */
  leftNode?: React.ReactNode;
  /** Option to hide the default Sign Out button */
  hideSignOut?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  initialRole = null,
  navLinks,
  customNav,
  rightActions,
  leftNode,
  hideSignOut = false,
}) => {
  const router = useRouter();
  const [role, setRole] = useState<"business" | "candidate" | null>(initialRole);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(initialRole));
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsAuthenticated(true);
        // Fetch role from users table
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (userData?.role) {
          setRole(userData.role as "business" | "candidate");
        }
      } else if (!initialRole) {
        setIsAuthenticated(false);
        setRole(null);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          fetchUser();
        } else {
          setIsAuthenticated(false);
          setRole(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [initialRole]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/api/signout", { method: "POST" });
      setIsAuthenticated(false);
      setRole(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Failed to sign out", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Determine nav links based on role / auth status if customNav/navLinks not provided
  const getNavLinks = () => {
    if (navLinks) return navLinks;

    if (!isAuthenticated) {
      return [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/modules", label: "Modules" },
        { href: "/login", label: "Sign in" },
      ];
    }

    if (role === "candidate") {
      return [
        { href: "/", label: "Home" },
        { href: "/modules", label: "Modules" },
        { href: "/candidate/dashboard", label: "My Dashboard" },
      ];
    }

    if (role === "business") {
      return [
        { href: "/", label: "Home" },
        { href: "/business/dashboard", label: "Dashboard" },
      ];
    }

    return [
      { href: "/", label: "Home" },
      { href: "/modules", label: "Modules" },
    ];
  };

  const links = getNavLinks();
  const showDefaultSignOut = isAuthenticated && !hideSignOut && !rightActions;

  return (
    <header className="bg-zinc-900 shadow-md border-b border-zinc-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Optional Left Node */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/assets/CCLogoTransparent.png"
              alt="CodeConquest Logo"
              width={44}
              height={44}
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-xl text-white font-bold tracking-tight group-hover:text-blue-400 transition-colors">
              CodeConquest
            </span>
          </Link>

          {leftNode && <div className="flex items-center">{leftNode}</div>}
        </div>

        {/* Right Section: Navigation + Actions */}
        <div className="flex items-center gap-6 ml-auto">
          {customNav ? (
            customNav
          ) : (
            <nav role="navigation" className="flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-300 hover:text-white font-medium transition-colors text-sm sm:text-base"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {(rightActions || showDefaultSignOut) && (
            <div className="flex items-center gap-4">
              {rightActions}

              {showDefaultSignOut && (
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-sm font-medium transition-all disabled:opacity-50 border border-zinc-700"
                >
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


