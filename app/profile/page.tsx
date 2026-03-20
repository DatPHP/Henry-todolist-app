"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.birthday) {
        setBirthday(new Date(user.birthday).toISOString().slice(0, 10));
      }
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const mutation = useMutation({
    mutationFn: async (updatedData: { name: string; birthday: string | null }) => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, birthday: birthday || null });
  };

  if (isLoading) {
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
            disabled={mutation.isPending}
            className={`w-full bg-emerald-500 text-white p-4 justify-center items-center rounded-xl hover:bg-emerald-600 transition-colors font-semibold shadow-lg shadow-emerald-500/20 active:scale-[0.98] ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
