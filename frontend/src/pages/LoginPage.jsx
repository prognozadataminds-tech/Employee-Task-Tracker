import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      navigate("/filter"); // ✅ redirect to Filter Page after login
    } else {
      alert("Invalid credentials! Try admin / 1234");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-center">Login</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-4 py-2 text-white font-semibold hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
