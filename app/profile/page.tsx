"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.name) setName(data.name);
        if (data.birthday) {
          // Format as YYYY-MM-DD for date input
          setBirthday(new Date(data.birthday).toISOString().slice(0, 10));
        }
      })
      .catch(() => {
        router.push("/login"); // Token might be invalid
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, birthday: birthday || null }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen todoBackground flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen todoBackground flex flex-col justify-center items-center py-10 px-4">
      <div className="max-w-[450px] w-full text-left mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-black font-semibold flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm transition-all"
        >
          <span>&larr; Back to Home</span>
        </button>
      </div>

      <div className="w-full max-w-[450px] bg-white p-8 rounded-[30px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Your Profile</h2>
        <p className="text-gray-500 mb-8">Update your personal details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white p-4 justify-center items-center rounded-xl hover:bg-emerald-600 transition-colors font-semibold shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            Save Changes
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
