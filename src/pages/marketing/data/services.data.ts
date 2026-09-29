import {
  Code,
  Palette,
  TrendingUp,
  Shield,
  Award,
  Zap,
  BarChart3,
  Star,
} from "lucide-react";

export interface Service {
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
  isFeatured: boolean;
}

export const serviceIconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  TrendingUp,
  Shield,
  Award,
  Zap,
  BarChart3,
  Star,
};

export const serviceIconColors: Record<string, string> = {
  "web-development": "text-cyan-300",
  "web-design": "text-violet-300",
  "website-management": "text-cyan-300",
  marketing: "text-amber-300",
};



export const fallbackServiceCards = [
  {
    _id: "s1",
    name: "Modern Website Development",
    description:
      "We build fast, modern web apps with clean UX, strong performance, and the right tools for your growth.",
    icon: "Code",
    colorClass: "bg-slate-800/80 border-slate-700",
    category: "web-development",
    price: 0,
    priceUnit: "",
    priceLabel: "",
    features: [],
    badge: "",
    isFeatured: false,
  },
  {
    _id: "s2",
    name: "Sleek Landing Pages",
    description:
      "Landing experiences designed to stop scrolling, convert visitors, and bring clarity to your offer.",
    icon: "Zap",
    colorClass: "bg-slate-800/80 border-slate-700",
    category: "web-design",
    price: 0,
    priceUnit: "",
    priceLabel: "",
    features: [],
    badge: "",
    isFeatured: false,
  },
  {
    _id: "s3",
    name: "Website Design Overhauls",
    description:
      "Refresh your website with a polished visual system that reflects your brand and makes every page feel premium.",
    icon: "Palette",
    colorClass: "bg-slate-800/80 border-slate-700",
    category: "web-design",
    price: 0,
    priceUnit: "",
    priceLabel: "",
    features: [],
    badge: "",
    isFeatured: false,
  },
  {
    _id: "s4",
    name: "Marketing Campaign Management",
    description:
      "Strategic campaign planning, execution, and optimization to reach your target audience and drive measurable results.",
    icon: "BarChart3",
    colorClass: "bg-slate-800/80 border-slate-700",
    category: "marketing",
    price: 220,
    priceUnit: "/month",
    priceLabel: "",
    features: [],
    badge: "",
    isFeatured: false,
  },
];

export const fallbackManagementPlans = [
  {
    _id: "m1",
    name: "Silver",
    price: 80,
    priceUnit: "/month",
    priceLabel: "",
    icon: "Shield",
    colorClass: "bg-neutral-900/80 border-neutral-800",
    badge: "",
    features: [
      "Hosting & uptime monitoring",
      "Security updates",
      "Minor content changes",
      "Email support",
    ],
    category: "website-management",
    description: "",
    isFeatured: false,
  },
  {
    _id: "m2",
    name: "Gold",
    price: 100,
    priceUnit: "/month",
    priceLabel: "",
    icon: "Award",
    colorClass: "bg-neutral-900/80 border-neutral-800",
    badge: "Most Popular",
    features: [
      "Everything in Silver",
      "Priority updates",
      "Performance monitoring",
      "Monthly check-ins",
    ],
    category: "website-management",
    description: "",
    isFeatured: true,
  },
  {
    _id: "m4",
    name: "Website Traffic Enhancement",
    price: 160,
    priceUnit: "/month",
    priceLabel: "",
    icon: "TrendingUp",
    colorClass: "bg-neutral-900/80 border-neutral-800",
    badge: "",
    features: [
      "Keyword targeting",
      "Technical SEO",
      "Content strategy",
      "Monthly reporting",
      "Ongoing adjustments",
    ],
    category: "marketing",
    description: "",
    isFeatured: false,
  },
  {
    _id: "m3",
    name: "Marketing Campaign",
    price: 220,
    priceUnit: "/month",
    priceLabel: "",
    icon: "BarChart3",
    colorClass: "bg-neutral-900/80 border-neutral-800",
    badge: "",
    features: [
      "Campaign strategy & planning",
      "Multi-channel execution",
      "Performance analytics & reporting",
      "Creative copywriting & assets",
      "Monthly optimization & adjustments",
    ],
    category: "marketing",
    description: "",
    isFeatured: false,
  },
];

export const servicesStats = [
  {
    value: "100%",
    label: "Service Focus",
  },
  {
    value: "Fast",
    label: "Delivery",
  },
  {
    value: "Secure",
    label: "Site Care",
  },
];