import { Service } from "../models/Service.js";

// Default services seeded from the original hardcoded page data
const DEFAULT_SERVICES = [
  // ── Service cards ──────────────────────────────────────────────────────────
  {
    name: "Modern Website Development",
    description:
      "We build fast, modern web apps with clean UX, strong performance, and the right tools for your growth.",
    category: "web-development",
    price: 0,
    priceLabel: "Get a Quote",
    priceUnit: "",
    features: ["Custom design & development", "Performance optimized", "Mobile responsive", "SEO ready"],
    icon: "Code",
    colorClass: "bg-slate-800/80 border-slate-700",
    sortOrder: 1,
  },
  {
    name: "Sleek Landing Pages",
    description:
      "Landing experiences designed to stop scrolling, convert visitors, and bring clarity to your offer.",
    category: "web-design",
    price: 0,
    priceLabel: "Get a Quote",
    priceUnit: "",
    features: ["Conversion-focused layout", "Fast load times", "A/B test ready", "Analytics integration"],
    icon: "Zap",
    colorClass: "bg-slate-800/80 border-slate-700",
    sortOrder: 2,
  },
  {
    name: "Website Design Overhauls",
    description:
      "Refresh your website with a polished visual system that reflects your brand and makes every page feel premium.",
    category: "web-design",
    price: 0,
    priceLabel: "Get a Quote",
    priceUnit: "",
    features: ["Brand audit", "Visual system redesign", "Content restructure", "User experience review"],
    icon: "Palette",
    colorClass: "bg-slate-800/80 border-slate-700",
    sortOrder: 3,
  },
  {
    name: "Marketing Campaign Management",
    description:
      "Strategic campaign planning, execution, and optimization to reach your target audience and drive measurable results.",
    category: "marketing",
    price: 220,
    priceUnit: "/month",
    features: [
      "Campaign strategy & planning",
      "Multi-channel execution",
      "Performance analytics & reporting",
      "Creative copywriting & assets",
      "Monthly optimization & adjustments",
    ],
    icon: "BarChart3",
    colorClass: "bg-slate-800/80 border-slate-700",
    sortOrder: 4,
  },
  // ── Management plans ───────────────────────────────────────────────────────
  {
    name: "Silver Plan",
    description: "No long-term contracts. Cancel anytime.",
    category: "website-management",
    price: 80,
    priceUnit: "/month",
    features: [
      "Hosting & uptime monitoring",
      "Security updates",
      "Minor content changes",
      "Email support",
    ],
    icon: "Shield",
    colorClass: "bg-neutral-900/80 border-neutral-800",
    sortOrder: 5,
  },
  {
    name: "Gold Plan",
    description: "No long-term contracts. Cancel anytime.",
    category: "website-management",
    price: 100,
    priceUnit: "/month",
    features: [
      "Everything in Silver",
      "Priority updates",
      "Performance monitoring",
      "Monthly check-ins",
    ],
    icon: "Award",
    colorClass: "bg-violet-950/90 border-violet-800",
    badge: "Most Popular",
    isFeatured: true,
    sortOrder: 6,
  },
  {
    name: "Website Traffic Enhancement",
    description:
      "Keyword optimization, technical SEO, and content strategy work together to help your business show up where customers are already searching.",
    category: "marketing",
    price: 160,
    priceUnit: "/month",
    features: [
      "Keyword targeting that matches real customer search behavior",
      "Technical SEO that helps search engines crawl and rank your site",
      "Content strategy that positions your brand as the best solution",
      "Monthly reporting on growth, rankings, and results",
      "Ongoing adjustments for algorithm changes and competitor activity",
    ],
    icon: "TrendingUp",
    colorClass: "bg-slate-800/80 border-slate-700",
    sortOrder: 7,
  },
];

// Seed on startup: insert all services if collection is empty,
// then insert any individual defaults that are missing (handles additions after initial seed).
export async function seedServicesIfEmpty() {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(DEFAULT_SERVICES);
    console.log("✓ Services seeded with defaults");
    return;
  }

  // Insert any default services that don't exist yet (by name)
  for (const svc of DEFAULT_SERVICES) {
    const exists = await Service.findOne({ name: svc.name });
    if (!exists) {
      await Service.create(svc);
      console.log(`✓ Added missing default service: ${svc.name}`);
    }
  }
}

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/services  — public, returns active services ordered by sortOrder
export const getPublicServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
    return res.status(200).json({ success: true, services });
  } catch (err) {
    console.error("getPublicServices Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Admin ────────────────────────────────────────────────────────────────────

// GET /api/services/admin  — admin, all services including inactive
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: 1 });
    return res.status(200).json({ success: true, services });
  } catch (err) {
    console.error("getAllServices Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/services/admin  — admin creates a service
export const createService = async (req, res) => {
  try {
    const {
      name, description, category, price, priceUnit, priceLabel,
      features, icon, colorClass, badge, isActive, isFeatured, sortOrder,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: "name and category are required" });
    }

    const service = await Service.create({
      name, description, category,
      price: price ?? 0,
      priceUnit: priceUnit ?? "",
      priceLabel: priceLabel ?? "",
      features: features ?? [],
      icon: icon ?? "Star",
      colorClass: colorClass ?? "bg-neutral-900/80 border-neutral-800",
      badge: badge ?? "",
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
    });

    return res.status(201).json({ success: true, service });
  } catch (err) {
    console.error("createService Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/services/admin/:id  — admin updates a service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, service });
  } catch (err) {
    console.error("updateService Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/services/admin/:id/price  — admin updates just price fields
export const updatePrice = async (req, res) => {
  try {
    const { price, priceUnit, priceLabel } = req.body;
    const updates = {};
    if (price !== undefined) updates.price = price;
    if (priceUnit !== undefined) updates.priceUnit = priceUnit;
    if (priceLabel !== undefined) updates.priceLabel = priceLabel;

    const service = await Service.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, service });
  } catch (err) {
    console.error("updatePrice Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/services/admin/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    console.error("deleteService Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
