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

    <div className="flex items-center justify-center h-screen">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

        <p className="text-sm text-center">

          Do you have account ?

          <a href="/register" className="text-blue-600 ml-1">
            Register
          </a>

        </p>

      </form>

    </div>
  )
}