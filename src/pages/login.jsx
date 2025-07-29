import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TA_Login_Img from "../assets/TA-Login-01.jpg"; // Adjust the path as necessary
import validationData from "../data/validation.json"; // Import validation data
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const isValidUser = validationData.some(
        (user) => user.email === email && user.password === password
      );

      if (isValidUser) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 500); // Simulated API delay
  };

  // Render page with image taking half the screen and form on the other half

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        {/* Image is href */}
        <img
          // src="https://tdas-stage.acruxtek.net/assets/scoop/login/TA-Login-01.jpg"
          src={TA_Login_Img}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <img
          src="https://tdas-stage.acruxtek.net/assets/imgs/TDAS%20Logo%20new.png"
          alt="Login Illustration"
          className="w-64 mb-6"
        />
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
