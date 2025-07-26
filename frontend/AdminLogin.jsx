import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "/images/hk-background.png";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "aurum2024";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "yes");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/70 p-8 rounded-lg text-white w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            placeholder="Username"
            className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="bg-red-700 text-white rounded p-2 mb-3 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#B8860B] text-black font-semibold py-3 rounded hover:bg-[#dac44d] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
