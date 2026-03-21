"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen todoBackground flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="todoContent p-8 rounded-2xl border border-gray-200 shadow-lg w-[350px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">Login</h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} w-full p-3 rounded-lg focus:outline-none focus:border-black`}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} w-full p-3 rounded-lg focus:outline-none focus:border-black`}
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button 
          disabled={loading}
          className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800 transition mt-2 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center pt-2">
          Do you have account ?
          <a href="/register" className="text-blue-600 ml-1 hover:underline">
            Register
          </a>
        </p>
        <p className="text-sm text-center mt-3">
          Did you forget your password?{" "}
          <a
            href="/reset-password"
            className="text-blue-500 hover:underline"
          >
            Reset here
          </a>
        </p>
      </form>
    </div>
  );
}