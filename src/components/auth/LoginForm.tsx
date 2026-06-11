import { useState } from "react";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";


interface LoginFormProps {
  onSubmit?: (
    email: string,
    password: string
  ) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: "easeOut",
    },
  }),
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useUser(); // ⭐ Use UserContext login()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ⭐ Use UserContext login()
      const result = await login(email, password);

      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }

      const user = result.user;

      // Optional callback
      onSubmit?.(email, password);

      // ⭐ Role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="
        w-full max-w-md mx-auto
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-8 sm:p-10
        shadow-[0_8px_40px_rgba(0,0,0,0.5)]
      "
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        variants={fadeUp}
        custom={1}
      >
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 mb-5">
          <LogIn className="w-5 h-5 text-neutral-300" />
        </span>

        <span className="block mb-3 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase w-fit mx-auto">
          Employee Portal
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          Welcome{" "}
          <span className="text-neutral-400 font-normal italic">
            Back
          </span>
        </h2>

        <p className="text-neutral-500 text-sm mt-2">
          Sign in to access the
          Fantome dashboard.
        </p>

        <div className="mt-6 mx-auto w-16 h-px bg-neutral-700" />
      </motion.div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Email */}
        <motion.div
          variants={fadeUp}
          custom={2}
        >
          <label className="block text-neutral-400 text-xs tracking-widest uppercase mb-2">
            Email
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Mail className="w-4 h-4 text-neutral-600" />
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="you@fantometechnologies.com"
              className="
                w-full pl-10 pr-4 py-3
                bg-neutral-800 border border-neutral-700
                rounded-xl text-white text-sm
                placeholder:text-neutral-600
                focus:outline-none focus:border-neutral-500
                transition-all duration-200
              "
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          variants={fadeUp}
          custom={3}
        >
          <label className="block text-neutral-400 text-xs tracking-widest uppercase mb-2">
            Password
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Lock className="w-4 h-4 text-neutral-600" />
            </span>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              className="
                w-full pl-10 pr-10 py-3
                bg-neutral-800 border border-neutral-700
                rounded-xl text-white text-sm
                placeholder:text-neutral-600
                focus:outline-none focus:border-neutral-500
                transition-all duration-200
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.button
          variants={fadeUp}
          custom={4}
          type="submit"
          disabled={loading}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-2 w-full flex items-center justify-center gap-2
            py-3 px-6 rounded-xl
            bg-neutral-800 border border-neutral-700
            text-white text-xs tracking-widest uppercase font-medium
            hover:bg-neutral-700 hover:border-neutral-600
            transition-all duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-neutral-300" />
              Sign In
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}