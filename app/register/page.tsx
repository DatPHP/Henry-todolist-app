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

    <div className="flex items-center justify-center h-screen">

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">
          Register
        </h1>

        <input
          placeholder="Name"
          className="border w-full p-2"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />

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

        <button className="bg-green-600 text-white w-full p-2 rounded">
          Register
        </button>

      </form>

    </div>

  )
}