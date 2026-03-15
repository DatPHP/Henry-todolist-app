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
        className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded flex items-center justify-center"
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
