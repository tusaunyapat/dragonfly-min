"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient(); // Initialize Supabase client
  const [hasAuthenticated, setHasAuthenticated] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setHasAuthenticated(true);
      }
    };
    getUser();
  }, []);

  return (
    <div className="navbar bg-base-100 fixed px-4 z-999 shadow-md z-[999999]">
      <div className="flex-1">
        <a className="btn btn-ghost text-black text-xl" href="/">
          Dragonfly
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {hasAuthenticated && (
            <li>
              <Link href="/shelf" className="text-warning">
                manage shelf
              </Link>
            </li>
          )}
          {hasAuthenticated && (
            <li>
              <Link href="/" className="text-warning">
                shelf
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
