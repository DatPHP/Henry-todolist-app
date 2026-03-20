"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

export default function LogoutButton({ className = "mb-4" }: { className?: string }) {
  const [name, setName] = useState("");
  const greeting = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setName(data.name);
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={`flex flex-row items-center justify-between gap-3 bg-[#f5f5ed] p-4 sm:px-6 rounded-xl shadow-md border border-gray-200 relative z-10 ${className}`}>
      {name && (
        <p className="text-sm sm:text-base font-medium text-gray-700 truncate min-w-0 flex-1">
          <i>{greeting}</i>, <b>{name}</b>!
        </p>
      )}
      <div className="flex gap-2 flex-shrink-0">
        <Link
          href="/profile"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded flex items-center justify-center transition-colors"
          title="Profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded flex items-center justify-center transition-colors"
          title="Logout"
        >
          <img
            src="/logout-svgrepo-com.svg"
            alt="logout"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
