import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function CreateEmployeePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState(""); // ⭐ NEW
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const handleCreate = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Use axios api instance (has token interceptor)
      const res = await api.post("/admin/employees", {
        name,
        email,
        role,
        password,
      });

      setMessage("Employee created successfully!");
      setName("");
      setEmail("");
      setRole("employee");
      setPassword("");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create employee";
      setMessage(errorMsg);
      console.error("Create Employee Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="Create Employee" />

      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <DashCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">New Employee Details</h3>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            {/* ⭐ NEW PASSWORD FIELD */}
            <input
              type="password"
              placeholder="Temporary Password (dev only)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>

            {message && (
              <p className="text-center text-sm text-white mt-2">{message}</p>
            )}
          </div>
        </DashCard>
      </motion.div>
    </PageContainer>
  );
}
