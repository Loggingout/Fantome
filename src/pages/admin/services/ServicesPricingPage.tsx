import { useEffect, useState } from "react";
import { Pencil, Check, X, DollarSign, Tag, Eye, EyeOff, TrendingUp } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  priceUnit: string;
  priceLabel: string;
  isActive: boolean;
  isFeatured: boolean;
  badge: string;
  sortOrder: number;
}

interface EditState {
  price: string;
  priceUnit: string;
  priceLabel: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "web-development": "Web Dev",
  "web-design": "Web Design",
  "website-management": "Management",
  "marketing": "Marketing",
};

const CATEGORY_BADGE: Record<string, string> = {
  "web-development": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "web-design": "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  "website-management": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "marketing": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

export default function ServicesPricingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, EditState>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    api.get("/services/admin")
      .then((res) => setServices(res.data?.services ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (s: Service) =>
    setEditing((p) => ({
      ...p,
      [s._id]: { price: String(s.price), priceUnit: s.priceUnit, priceLabel: s.priceLabel },
    }));

  const cancelEdit = (id: string) =>
    setEditing((p) => { const n = { ...p }; delete n[id]; return n; });

  const setField = (id: string, field: keyof EditState, val: string) =>
    setEditing((p) => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const savePrice = async (id: string) => {
    const vals = editing[id];
    if (!vals) return;
    setSaving(id);
    try {
      const res = await api.patch(`/services/admin/${id}/price`, {
        price: Number(vals.price),
        priceUnit: vals.priceUnit,
        priceLabel: vals.priceLabel,
      });
      setServices((p) => p.map((s) => s._id === id ? { ...s, ...res.data.service } : s));
      cancelEdit(id);
      setSaved(id);
      setTimeout(() => setSaved(null), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  // Stats
  const pricedCount = services.filter((s) => s.price > 0 && !s.priceLabel).length;
  const quoteCount = services.filter((s) => s.priceLabel).length;
  const activeCount = services.filter((s) => s.isActive).length;
  const totalRevenuePotential = services
    .filter((s) => s.price > 0 && s.priceUnit.includes("month"))
    .reduce((sum, s) => sum + s.price, 0);

  const displayPrice = (s: Service) => {
    if (s.priceLabel) return s.priceLabel;
    if (s.price > 0) return `$${s.price}${s.priceUnit}`;
    return "—";
  };

  return (
    <PageContainer>
      <SectionHeader title="Services Pricing" />
      <p className="text-neutral-500 text-sm mb-6 -mt-2">
        Edit pricing for any service. Changes go live on the public services page immediately.
      </p>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Tag, label: "Total Services", value: String(services.length), color: "text-white" },
          { icon: DollarSign, label: "Fixed Priced", value: String(pricedCount), color: "text-emerald-400" },
          { icon: TrendingUp, label: "Quote-Based", value: String(quoteCount), color: "text-amber-400" },
          { icon: Eye, label: "Active", value: `${activeCount} / ${services.length}`, color: "text-blue-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <DashCard key={label} className="p-4 gap-1">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-neutral-500 text-xs">{label}</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </DashCard>
        ))}
      </div>

      {totalRevenuePotential > 0 && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-emerald-300 text-sm">
            <span className="font-semibold">${totalRevenuePotential}/mo</span>
            <span className="text-emerald-500 ml-2">combined monthly recurring potential across priced plans</span>
          </p>
        </div>
      )}

      {/* ── Pricing table ──────────────────────────────────────────────────── */}
      <DashCard className="p-0 overflow-hidden">
        {loading ? (
          <p className="text-neutral-400 text-sm p-6">Loading…</p>
        ) : services.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center p-10">
            No services found. Add services from the All Services page first.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50">
                  <th className="text-left px-5 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Service</th>
                  <th className="text-left px-4 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Current Price</th>
                  <th className="text-left px-4 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Unit</th>
                  <th className="text-left px-4 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Label Override</th>
                  <th className="text-left px-4 py-3.5 text-neutral-500 font-medium text-xs uppercase tracking-wide">Visibility</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {services.map((s) => {
                  const isEditing = !!editing[s._id];
                  const vals = editing[s._id];
                  const isSaved = saved === s._id;

                  return (
                    <tr
                      key={s._id}
                      className={`transition-colors ${isEditing ? "bg-neutral-800/30" : "hover:bg-neutral-800/20"}`}
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="text-white font-medium leading-tight">{s.name}</p>
                        {s.badge && (
                          <span className="text-xs text-fuchsia-400">{s.badge}</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_BADGE[s.category] ?? "bg-neutral-800 text-neutral-400"}`}>
                          {CATEGORY_LABELS[s.category] ?? s.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 text-xs">$</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={vals.price}
                              onChange={(e) => setField(s._id, "price", e.target.value)}
                              className="w-20 bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-neutral-400"
                            />
                          </div>
                        ) : (
                          <p className={`font-semibold ${s.price > 0 ? "text-white" : "text-neutral-600"}`}>
                            {s.price > 0 ? `$${s.price}` : "—"}
                          </p>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            value={vals.priceUnit}
                            onChange={(e) => setField(s._id, "priceUnit", e.target.value)}
                            placeholder="/month"
                            className="w-24 bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-400 text-sm">{s.priceUnit || "—"}</p>
                        )}
                      </td>

                      {/* Label Override */}
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            value={vals.priceLabel}
                            onChange={(e) => setField(s._id, "priceLabel", e.target.value)}
                            placeholder="Get a Quote"
                            className="w-36 bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-neutral-400"
                          />
                        ) : (
                          <p className={`text-sm ${s.priceLabel ? "text-amber-400" : "text-neutral-600"}`}>
                            {s.priceLabel || "—"}
                          </p>
                        )}
                      </td>

                      {/* Visibility */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {s.isActive
                            ? <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            : <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                          }
                          <span className={`text-xs ${s.isActive ? "text-emerald-400" : "text-neutral-600"}`}>
                            {s.isActive ? "Live" : "Hidden"}
                          </span>
                          {isSaved && (
                            <span className="ml-2 text-xs text-emerald-400 font-medium animate-pulse">Saved ✓</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => savePrice(s._id)}
                              disabled={saving === s._id}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              {saving === s._id ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => cancelEdit(s._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-lg hover:bg-neutral-700 hover:text-white transition"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit Price
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>

      <p className="text-neutral-600 text-xs mt-4">
        To add, remove, or reorder services — use the{" "}
        <a href="/admin/services" className="text-neutral-400 underline hover:text-white transition">
          All Services
        </a>{" "}
        page. The <em>Label Override</em> field replaces the price display entirely (e.g. "Get a Quote").
      </p>
    </PageContainer>
  );
}
