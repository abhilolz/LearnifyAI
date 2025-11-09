import { useState } from "react";
import api from "../api/axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // ✅ save token
      onLogin(); // ✅ tell parent that login succeeded
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">LearnifyAI Login</h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-md text-gray-900"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 p-2 rounded-md"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
