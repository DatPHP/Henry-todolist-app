"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage(){

  const router = useRouter()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  async function submit(e:any){

    e.preventDefault()

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    })

    if(res.ok){

      alert("Register success")

      router.push("/login")

    }

  }

  return(
    <div className="min-h-screen todoBackground flex items-center justify-center">
      <form onSubmit={submit} className="todoContent p-8 rounded-2xl border border-gray-200 shadow-lg w-[350px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          Register
        </h1>

        <input
          placeholder="Name"
          className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:border-black"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />

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

        <button className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800 transition mt-2">
          Register
        </button>
      </form>
    </div>
  )
}