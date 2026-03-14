"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  async function handleSubmit(e:any){

    e.preventDefault();

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    })

    const data = await res.json()

    if(!res.ok){
      setError(data.error)
      return
    }

    localStorage.setItem("token",data.token)

    router.push("/")
  }

  return (
    <div className="min-h-screen todoBackground flex items-center justify-center">
      <form onSubmit={handleSubmit} className="todoContent p-8 rounded-2xl border border-gray-200 shadow-lg w-[350px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:border-black"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:border-black"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800 transition mt-2">
          Login
        </button>

        <p className="text-sm text-center pt-2">
          Do you have account ?
          <a href="/register" className="text-blue-600 ml-1 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}