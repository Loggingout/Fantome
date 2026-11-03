import { StatusPlatform } from "../models/StatusPlatform.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import emailService from "../services/emailService.js";

const STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded Performance",
  maintenance: "Maintenance",
  outage: "Service Outage",
  being_developed: "Being Developed",
  unknown: "Status Unknown",
};

const VALID_STATUSES = new Set(Object.keys(STATUS_LABELS));

const DEFAULT_PLATFORMS = [
  {
    slug: "mystery-mansion",
    name: "Mystery Mansion",
    category: "SaaS Platform",
    description:
      "A platform developed and operated within the Fantome Technologies ecosystem.",
    status: "unknown",
    enabled: true,
  },
  {
    slug: "isittrue-news",
    name: "IsItTrueNews",
    category: "SaaS Platform",
    description:
      "A platform developed and operated within the Fantome Technologies ecosystem. Built to reshape how the truth is discovered, verified, and shared around the world.",
    status: "being_developed",
    enabled: true,
  },
];

const HISTORY_DAYS = 90;
const VALID_INCIDENT_STATUSES = new Set(["investigating", "identified", "monitoring", "resolved"]);

const dayKey = (date) => date.toISOString().slice(0, 10);

// History stores the last status per day; days without an entry carry the previous status forward.
function buildUptime(platform) {
  const recorded = new Map(platform.history.map((point) => [point.date, point.status]));
  const firstRecorded = [...recorded.keys()].sort()[0];
  const uptimeHistory = [];
  let current = "unknown";

  for (let offset = HISTORY_DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    const key = dayKey(date);

    if (recorded.has(key)) {
      current = recorded.get(key);
    } else if (!firstRecorded || key < firstRecorded) {
      current = "unknown";
    }

    uptimeHistory.push({ date: key, status: current });
  }

  const measured = uptimeHistory.filter(
    ({ status }) => status === "operational" || status === "degraded" || status === "outage"
  );
  const operational = measured.filter(({ status }) => status === "operational").length;
  const uptimePercentage = measured.length ? (operational / measured.length) * 100 : null;

  return { uptimeHistory, uptimePercentage };
}

const toIncidentRecord = (incident, platformName) => ({
  id: incident._id.toString(),
  title: incident.title,
  message: incident.message || "",
  status: incident.status,
  startedAt: incident.startedAt?.toISOString(),
  updatedAt: incident.updatedAt?.toISOString(),
  resolvedAt: incident.resolvedAt ? incident.resolvedAt.toISOString() : null,
  affectedPlatforms: [platformName],
});

const toStatusRecord = (platform) => ({
  id: platform.slug,
  name: platform.name,
  category: platform.category,
  description: platform.description,
  status: platform.status,
  statusLabel: STATUS_LABELS[platform.status],
  message: platform.message || "",
  updatedAt: platform.updatedAt?.toISOString(),
  updatedBy: platform.updatedBy || "",
  enabled: platform.enabled,
  ...buildUptime(platform),
  incidents: [...platform.incidents]
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, 10)
    .map((incident) => toIncidentRecord(incident, platform.name)),
});

function recordHistory(platform) {
  const today = dayKey(new Date());
  const existing = platform.history.find((point) => point.date === today);

  if (existing) {
    existing.status = platform.status;
  } else {
    platform.history.push({ date: today, status: platform.status });
  }

  platform.history = platform.history.slice(-HISTORY_DAYS);
}

function applyIncident(platform, input) {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const status = VALID_INCIDENT_STATUSES.has(input.status) ? input.status : "investigating";
  const active = platform.incidents.find((incident) => incident.status !== "resolved");
  const target = active ?? (title ? platform.incidents.create({ title }) : null);

  if (!target) return;

  if (title) target.title = title;
  target.message = message;
  target.status = status;
  target.resolvedAt = status === "resolved" ? new Date() : null;

  if (!active) platform.incidents.push(target);
  return target;
}

async function notifySubscribers(platform, incident) {
  const subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null }).select(
    "email unsubscribeToken"
  );

  for (const subscriber of subscribers) {
    try {
      await emailService.sendStatusUpdate({
        to: subscriber.email,
        platform: {
          name: platform.name,
          status: platform.status,
          statusLabel: STATUS_LABELS[platform.status],
          message: platform.message,
        },
        incident: incident && {
          title: incident.title,
          message: incident.message,
          status: incident.status,
        },
        unsubscribeUrl: emailService.createUnsubscribeUrl(subscriber.unsubscribeToken),
      });
    } catch (error) {
      console.error(`Status email failed for ${subscriber.email}:`, error.message);
    }
  }
}

export async function getIncidentHistory(_req, res) {
  try {
    const platforms = await StatusPlatform.find({ enabled: true });
    const incidents = platforms
      .flatMap((platform) =>
        platform.incidents.map((incident) => toIncidentRecord(incident, platform.name))
      )
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
      .slice(0, 200);

    return res.status(200).json(incidents);
  } catch (error) {
    console.error("getIncidentHistory error:", error);
    return res.status(500).json({ message: "Unable to retrieve incident history." });
  }
}

export async function seedStatusPlatforms() {
  await Promise.all(
    DEFAULT_PLATFORMS.map((platform) =>
      StatusPlatform.updateOne(
        { slug: platform.slug },
        { $setOnInsert: platform },
        { upsert: true }
      )
    )
  );
}

export async function getPublicStatuses(_req, res) {
  try {
    const platforms = await StatusPlatform.find({ enabled: true }).sort({ name: 1 });
    return res.status(200).json(platforms.map(toStatusRecord));
  } catch (error) {
    console.error("getPublicStatuses error:", error);
    return res.status(500).json({ message: "Unable to retrieve platform statuses." });
  }
}

export async function getAdminStatuses(_req, res) {
  try {
    const platforms = await StatusPlatform.find().sort({ name: 1 });
    return res.status(200).json(platforms.map(toStatusRecord));
  } catch (error) {
    console.error("getAdminStatuses error:", error);
    return res.status(500).json({ message: "Unable to retrieve platform statuses." });
  }
}

export async function createPlatform(req, res) {
  const { name, category, description, status = "unknown" } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "Platform name is required." });
  }

  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({ message: "Platform category is required." });
  }

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ message: "A valid platform status is required." });
  }

  const baseSlug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "platform";

  try {
    let slug = baseSlug;
    for (let suffix = 2; await StatusPlatform.exists({ slug }); suffix += 1) {
      slug = `${baseSlug}-${suffix}`;
    }

    const platform = new StatusPlatform({
      slug,
      name: name.trim(),
      category: category.trim(),
      description: typeof description === "string" ? description.trim() : "",
      status,
      updatedBy: req.user.email || req.user._id.toString(),
    });
    recordHistory(platform);
    await platform.save();

    return res.status(201).json(toStatusRecord(platform));
  } catch (error) {
    console.error("createPlatform error:", error);
    return res.status(500).json({ message: "Unable to create platform." });
  }
}

export async function updatePlatformStatus(req, res) {
  const { status, message, incident } = req.body ?? {};

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ message: "A valid platform status is required." });
  }

  if (message != null && typeof message !== "string") {
    return res.status(400).json({ message: "Status message must be text." });
  }

  try {
    const platform = await StatusPlatform.findOne({ slug: req.params.id });

    if (!platform) {
      return res.status(404).json({ message: "Platform status not found." });
    }

    const previousStatus = platform.status;
    const previousMessage = platform.message;

    platform.status = status;
    platform.message = message?.trim() ?? "";
    platform.updatedBy = req.user.email || req.user._id.toString();
    recordHistory(platform);

    let touchedIncident = null;
    if (incident && typeof incident === "object") {
      touchedIncident = applyIncident(platform, incident);
    }

    await platform.save();

    const changed =
      previousStatus !== platform.status ||
      previousMessage !== platform.message ||
      Boolean(touchedIncident);
    if (changed) {
      void notifySubscribers(platform, touchedIncident).catch((error) =>
        console.error("notifySubscribers error:", error.message)
      );
    }

    return res.status(200).json(toStatusRecord(platform));
  } catch (error) {
    console.error("updatePlatformStatus error:", error);
    return res.status(500).json({ message: "Unable to update platform status." });
  }
}
