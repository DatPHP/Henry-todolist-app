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
        <div className="min-h-screen todoBackground flex items-center justify-center">
            <div className="todoContent p-8 rounded-2xl border border-gray-200 shadow-lg w-[350px] space-y-4">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Reset Password
                </h1>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:border-black"
                />

                <button
                    onClick={checkEmail}
                    className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800 transition mt-2"
                >
                    Check Email
                </button>

                {message && (
                    <p className={`text-sm text-center ${emailValid ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}

                {emailValid && (
                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:border-black"
                        />

                        <button
                            onClick={resetPassword}
                            className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800 transition"
                        >
                            Save new password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

}