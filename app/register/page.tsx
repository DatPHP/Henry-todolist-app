"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterInput } from "@/lib/validations"
import { toast } from "react-toastify"
import { useState } from "react"

export default function RegisterPage(){
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput){
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })

      const result = await res.json()

      if(res.ok){
        toast.success("Registration successful!")
        router.push("/login")
      } else {
        toast.error(result.error || "Registration failed")
      }
    } catch (error) {
      toast.error("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="min-h-screen todoBackground flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="todoContent p-8 rounded-2xl border border-gray-200 shadow-lg w-[350px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          Register
        </h1>

        <div>
          <input
            placeholder="Name"
            className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} w-full p-3 rounded-lg focus:outline-none focus:border-black`}
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline text-black">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}