import { useState } from "react";

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

export default function CompanySettings() {
  const [form, setForm] = useState<CompanyInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (key: keyof CompanyInfo, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    // Persist to localStorage until backend settings endpoint is added
    localStorage.setItem("companySettings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Company Name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition"
      />
      <input
        type="text"
        placeholder="Company Address"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition"
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition"
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition"
        />
      </div>
      <textarea
        placeholder="Company Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={4}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition resize-none"
      />
      <button
        onClick={handleSave}
        className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition"
      >
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}