import { useEffect, useState } from "react";
import { DollarSign, Eye, Mail, MousePointerClick, Target } from "lucide-react";

import PageContainer, { DashCard, SectionHeader } from "../../../components/layout/PageContainer";
import {
  getNewsletterAnalytics,
  type NewsletterAnalytics,
} from "../../../services/newsletterAnalyticsService";

const numberFormat = new Intl.NumberFormat("en-US");

export default function NewsletterAnalyticsPage() {
  const [analytics, setAnalytics] = useState<NewsletterAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getNewsletterAnalytics()
      .then((data) => {
        if (isCurrent) setAnalytics(data);
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load newsletter analytics.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const metrics = [
    {
      label: "Total Subscribers",
      value: isLoading ? "—" : numberFormat.format(analytics?.totalSubscribers ?? 0),
      detail: "Currently subscribed",
      icon: Mail,
      tracked: true,
    },
    {
      label: "Open Rate",
      value: "Not tracked",
      detail: "No email open events recorded",
      icon: Eye,
      tracked: false,
    },
    {
      label: "Click Rate",
      value: "Not tracked",
      detail: "Email link clicks are not attributed",
      icon: MousePointerClick,
      tracked: false,
    },
    {
      label: "Conversions",
      value: "Not tracked",
      detail: "No conversion events recorded",
      icon: Target,
      tracked: false,
    },
    {
      label: "Revenue Generated",
      value: "Not tracked",
      detail: "Revenue attribution is not configured",
      icon: DollarSign,
      tracked: false,
    },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Newsletter Analytics" />

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-5">
          {metrics.map(({ label, value, detail, icon: Icon, tracked }) => (
            <article
              key={label}
              className="flex min-w-0 flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  {label}
                </p>
                <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
              </div>

              <p className={`wrap-break-word font-semibold leading-tight text-white ${tracked ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
                {value}
              </p>

              <p className="mt-auto text-xs text-neutral-600">{detail}</p>
            </article>
          ))}
        </div>

        {!error && !isLoading && analytics && (
          <DashCard className="gap-2">
            <h2 className="text-sm font-semibold text-white">Delivery activity</h2>
            <p className="text-sm leading-relaxed text-neutral-400">
              {numberFormat.format(analytics.blogEmailsSent)} blog emails sent
              {analytics.pendingBlogEmails > 0 &&
                ` · ${numberFormat.format(analytics.pendingBlogEmails)} pending`}
              . Open and click rates, conversions, and revenue require tracking
              events that are not currently collected.
            </p>
          </DashCard>
        )}
      </div>
    </PageContainer>
  );
}
