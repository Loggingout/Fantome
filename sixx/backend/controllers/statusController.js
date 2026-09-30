import { StatusPlatform } from "../models/StatusPlatform.js";

const STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded Performance",
  maintenance: "Maintenance",
  outage: "Service Outage",
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
];

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
});

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

export async function updatePlatformStatus(req, res) {
  const { status, message } = req.body ?? {};

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ message: "A valid platform status is required." });
  }

  if (message != null && typeof message !== "string") {
    return res.status(400).json({ message: "Status message must be text." });
  }

  try {
    const platform = await StatusPlatform.findOneAndUpdate(
      { slug: req.params.id },
      {
        $set: {
          status,
          message: message?.trim() ?? "",
          updatedBy: req.user.email || req.user._id.toString(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!platform) {
      return res.status(404).json({ message: "Platform status not found." });
    }

    return res.status(200).json(toStatusRecord(platform));
  } catch (error) {
    console.error("updatePlatformStatus error:", error);
    return res.status(500).json({ message: "Unable to update platform status." });
  }
}
