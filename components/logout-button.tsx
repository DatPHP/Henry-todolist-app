"use client";

export default function LogoutButton({ className = "mb-4" }: { className?: string }) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={`flex justify-end ${className}`}>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
