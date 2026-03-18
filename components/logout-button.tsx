"use client";

import { useEffect, useState } from "react";

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
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {name && (
        <p className="text-sm font-medium text-gray-700 truncate min-w-0 flex-1">
          <i>{greeting}</i>, <b>{name}</b>!
        </p>
      )}
      <button
        onClick={handleLogout}
        className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded flex items-center justify-center flex-shrink-0"
      >
        <img
          src="/logout-svgrepo-com.svg"
          alt="logout"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
