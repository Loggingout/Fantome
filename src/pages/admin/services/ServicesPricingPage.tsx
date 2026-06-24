import { useEffect, useState } from "react";
import { Check, X, DollarSign } from "lucide-react";
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
}

const CATEGORY_LABELS: Record<string, string> = {
  "web-development": "Web Development",
  "web-design": "Web Design",
  "website-management": "Website Management",
  "marketing": "Marketing",
};

const CATEGORY_COLORS: Record<string, string> = {
  "web-development": "text-blue-400",
  "web-design": "text-violet-400",
  "website-management": "text-emerald-400",
  "marketing": "text-amber-400",
};

export default function ServicesPricingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, { price: string; priceUnit: string; priceLabel: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/services/admin")
      .then((res) => setServices(res.data.services))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (s: Service) => {
    setEditing((p) => ({
      ...p,
      [s._id]: { price: String(s.price), priceUnit: s.priceUnit, priceLabel: s.priceLabel },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditing((p) => { const n = { ...p }; delete n[id]; return n; });
  };

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
      setFeedback((p) => ({ ...p, [id]: "Saved" }));
      setTimeout(() => setFeedback((p) => ({ ...p, [id]: "" })), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  // Group services by category
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const displayPrice = (s: Service) => {
    if (s.priceLabel) return s.priceLabel;
    if (s.price > 0) return `$${s.price}${s.priceUnit}`;
    return "Contact for quote";
  };

  return (
    <PageContainer>
      <SectionHeader title="Services Pricing" />
      <p className="text-neutral-500 text-sm mb-6 -mt-2">
        Adjust pricing for any service. Changes appear on the public services page immediately.
      </p>

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading…</p>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${CATEGORY_COLORS[category] ?? "text-neutral-500"}`}>
                {CATEGORY_LABELS[category] ?? category}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((s) => {
                  const isEditing = !!editing[s._id];
                  const vals = editing[s._id];
                  return (
                    <DashCard key={s._id} className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{s.name}</p>
                          {s.badge && <p className="text-fuchsia-400 text-xs">{s.badge}</p>}
                          {!s.isActive && (
                            <span className="text-xs text-neutral-600 italic">Hidden</span>
                          )}
                        </div>
                        <DollarSign className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                      </div>

                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500 text-xs">$</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={vals.price}
                              onChange={(e) =>
                                setEditing((p) => ({ ...p, [s._id]: { ...p[s._id], price: e.target.value } }))
                              }
                              className="w-20 bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none"
                            />
                            <input
                              value={vals.priceUnit}
                              onChange={(e) =>
                                setEditing((p) => ({ ...p, [s._id]: { ...p[s._id], priceUnit: e.target.value } }))
                              }
                              placeholder="/month"
                              className="w-20 bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none"
                            />
                          </div>
                          <input
                            value={vals.priceLabel}
                            onChange={(e) =>
                              setEditing((p) => ({ ...p, [s._id]: { ...p[s._id], priceLabel: e.target.value } }))
                            }
                            placeholder="Label override (e.g. Get a Quote)"
                            className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none"
                          />
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => savePrice(s._id)}
                              disabled={saving === s._id}
                              className="flex-1 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-50"
                            >
                              {saving === s._id ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => cancelEdit(s._id)}
                              className="flex-1 py-1.5 text-xs bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-xl font-bold">{displayPrice(s)}</p>
                            {feedback[s._id] && (
                              <p className="text-emerald-400 text-xs mt-0.5">{feedback[s._id]}</p>
                            )}
                          </div>
                          <button
                            onClick={() => startEdit(s)}
                            className="px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-lg hover:bg-neutral-700 hover:text-white transition"
                          >
                            Edit Price
                          </button>
                        </div>
                      )}
                    </DashCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
