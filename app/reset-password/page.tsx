"use client";

import { useState } from "react";

export default function ResetPassword() {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [message, setMessage] = useState("");

    const checkEmail = async () => {

        if (!email) {
            alert("Email required");
            return;
        }

        const res = await fetch("/api/auth/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.exists) {
            setEmailValid(true);
            setMessage("Account available");
        } else {
            setMessage("Email not found");
        }

    };

    const resetPassword = async () => {

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
                email,
                newPassword
            }),
        });

        const data = await res.json();

        if (data.success) {

            alert("Password reset success");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        }

    };

    return (

        <div className="max-w-md mx-auto mt-20">

            <h1 className="text-xl font-bold mb-5">
                Reset Password
            </h1>

            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full mb-3"
            />

            <button
                onClick={checkEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Check Email
            </button>

            <p className="mt-3">{message}</p>

            {emailValid && (

                <>
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border p-2 w-full mt-4"
                    />

                    <button
                        onClick={resetPassword}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-3"
                    >
                        Save new password
                    </button>
                </>
            )}

        </div>
    );

}