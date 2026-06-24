import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: string;
  priceLabel: string;
  features: string[];
  icon: string;
  colorClass: string;
  badge: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { value: "web-development", label: "Web Development" },
  { value: "web-design", label: "Web Design" },
  { value: "website-management", label: "Website Management" },
  { value: "marketing", label: "Marketing" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "web-development": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "web-design": "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  "website-management": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "marketing": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

const BLANK: Omit<Service, "_id"> = {
  name: "", description: "", category: "web-development",
  price: 0, priceUnit: "/month", priceLabel: "",
  features: [], icon: "Star", colorClass: "bg-neutral-900/80 border-neutral-800",
  badge: "", isActive: true, isFeatured: false, sortOrder: 0,
};

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/services/admin")
      .then((res) => setServices(res.data?.services ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ ...BLANK });
    setFeatureInput("");
    setError("");
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing({ ...s });
    setFeatureInput("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const set = (key: string, val: unknown) =>
    setEditing((p) => p ? { ...p, [key]: val } : p);

  const addFeature = () => {
    const f = featureInput.trim();
    if (!f) return;
    set("features", [...(editing?.features ?? []), f]);
    setFeatureInput("");
  };

  const removeFeature = (i: number) =>
    set("features", (editing?.features ?? []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!editing?.name || !editing?.category) {
      setError("Name and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if ((editing as Service)._id) {
        const res = await api.put(`/services/admin/${(editing as Service)._id}`, editing);
        setServices((p) => p.map((s) => s._id === res.data.service._id ? res.data.service : s));
      } else {
        const res = await api.post("/services/admin", editing);
        setServices((p) => [...p, res.data.service]);
      }
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/services/admin/${id}`);
      setServices((p) => p.filter((s) => s._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      const res = await api.put(`/services/admin/${s._id}`, { ...s, isActive: !s.isActive });
      setServices((p) => p.map((x) => x._id === s._id ? res.data.service : x));
    } catch (err) { console.error(err); }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Services Management" />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-neutral-200 transition"
        >
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading…</p>
        ) : services.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-8">No services yet. Click "New Service" to add one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">#</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Name</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Category</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Price</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Icon</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Flags</th>
                  <th className="pb-3 pr-4 text-neutral-500 font-medium">Status</th>
                  <th className="pb-3 text-neutral-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {services.map((s, idx) => (
                  <tr key={s._id}>
                    <td className="py-3.5 pr-4 text-neutral-600 text-xs">{s.sortOrder || idx + 1}</td>
                    <td className="py-3.5 pr-4">
                      <p className="text-white font-medium">{s.name}</p>
                      {s.badge && (
                        <span className="text-xs text-fuchsia-400">{s.badge}</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLORS[s.category] ?? "bg-neutral-800 text-neutral-400"}`}>
                        {CATEGORIES.find((c) => c.value === s.category)?.label ?? s.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-neutral-300 font-medium">
                        {s.priceLabel || (s.price > 0 ? `$${s.price}${s.priceUnit}` : "Contact for quote")}
                      </p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <code className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">{s.icon || "—"}</code>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex gap-1.5">
                        {s.isFeatured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">Featured</span>
                        )}
                        {s.features.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500">{s.features.length} features</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <button onClick={() => toggleActive(s)} className="flex items-center gap-1.5 group">
                        {s.isActive
                          ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                          : <ToggleLeft className="w-5 h-5 text-neutral-600" />
                        }
                        <span className={`text-xs ${s.isActive ? "text-emerald-400" : "text-neutral-600"}`}>
                          {s.isActive ? "Active" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDelete === s._id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-neutral-500">Delete?</span>
                            <button onClick={() => handleDelete(s._id)} className="p-1 text-red-400 hover:text-red-300">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="p-1 text-neutral-500 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(s._id)}
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      {modalOpen && editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                {(editing as Service)._id ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-neutral-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Name *</label>
                <input value={editing.name ?? ""} onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Gold Plan"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Category *</label>
                <select value={editing.category ?? "web-development"} onChange={(e) => set("category", e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Description</label>
                <textarea rows={2} value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)}
                  placeholder="Short description shown on the services page…"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 resize-none" />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 text-xs mb-1.5">Price ($)</label>
                  <input type="number" min="0" step="1" value={editing.price ?? 0}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
                </div>
                <div>
                  <label className="block text-neutral-400 text-xs mb-1.5">Unit</label>
                  <input value={editing.priceUnit ?? ""} onChange={(e) => set("priceUnit", e.target.value)}
                    placeholder="/month"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
                </div>
                <div>
                  <label className="block text-neutral-400 text-xs mb-1.5">Label override</label>
                  <input value={editing.priceLabel ?? ""} onChange={(e) => set("priceLabel", e.target.value)}
                    placeholder="Get a Quote"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
                </div>
              </div>
              <p className="text-neutral-600 text-xs -mt-2">Label override replaces the price display if set.</p>

              {/* Features */}
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Features</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add feature and press Enter"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
                  <button onClick={addFeature}
                    className="px-3 py-2 bg-neutral-700 text-white rounded-xl hover:bg-neutral-600 transition text-sm">
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(editing.features ?? []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-neutral-800/60 rounded-lg px-3 py-1.5">
                      <span className="flex-1 text-neutral-300 text-sm">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-neutral-600 hover:text-red-400 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge + options row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 text-xs mb-1.5">Badge</label>
                  <input value={editing.badge ?? ""} onChange={(e) => set("badge", e.target.value)}
                    placeholder="Most Popular"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
                </div>
                <div>
                  <label className="block text-neutral-400 text-xs mb-1.5">Sort Order</label>
                  <input type="number" value={editing.sortOrder ?? 0} onChange={(e) => set("sortOrder", Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)}
                    className="w-4 h-4 accent-white" />
                  <span className="text-neutral-400 text-sm">Active (visible on site)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.isFeatured ?? false} onChange={(e) => set("isFeatured", e.target.checked)}
                    className="w-4 h-4 accent-white" />
                  <span className="text-neutral-400 text-sm">Featured</span>
                </label>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition disabled:opacity-50">
                  {saving ? "Saving…" : (editing as Service)._id ? "Save Changes" : "Create Service"}
                </button>
                <button onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-semibold text-sm hover:bg-neutral-700 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
