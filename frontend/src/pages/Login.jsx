import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await login(
        formData.email,
        formData.password
      );

      navigate("/chat");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-slate-950 flex items-center justify-center">
              <MessageSquare size={23} />
            </div>

            <span className="text-2xl font-bold">
              AI Chat
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">

          <div className="mb-7">
            <h1 className="text-2xl font-bold">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Login to continue chatting with AI.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm outline-none transition focus:border-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-white hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Your conversations are securely stored.
        </p>
      </div>
    </div>
  );
};

export default Login;