import { useCallback, useEffect, useState } from "react";

import StatusOverview from "../../../components/admin/status/StatusOverview";
import StatusPlatformTable from "../../../components/admin/status/StatusPlatformTable";
import UpdateStatusModal from "../../../components/admin/status/UpdateStatusModal";

import type {
  PlatformStatusRecord,
  StatusUpdatePayload,
} from "../../../types/status";

import {
  getPlatformStatuses,
  updatePlatformStatus,
} from "../../../services/statusService";

export default function StatusManagementPage() {
  const [platforms, setPlatforms] = useState<
    PlatformStatusRecord[]
  >([]);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformStatusRecord | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatuses = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const data = await getPlatformStatuses();

      setPlatforms(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve platform statuses.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatuses();
  }, [loadStatuses]);

  const handleUpdateStatus = async (
    payload: StatusUpdatePayload,
  ) => {
    if (!selectedPlatform) {
      return;
    }

    try {
      setError(null);
      setIsSaving(true);

      const updatedPlatform = await updatePlatformStatus(
        selectedPlatform.id,
        payload,
      );

      setPlatforms((current) =>
        current.map((platform) =>
          platform.id === updatedPlatform.id
            ? updatedPlatform
            : platform,
        ),
      );

      setSelectedPlatform(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update platform status.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          System Management
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          Ecosystem Status
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Monitor and update the public operating status of platforms
          within the Fantome Technologies ecosystem.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-10">
          <p className="text-sm text-neutral-500">
            Loading ecosystem status...
          </p>
        </div>
      ) : (
        <>
          <StatusOverview platforms={platforms} />

          <StatusPlatformTable
            platforms={platforms}
            onEdit={setSelectedPlatform}
            onRefresh={() => void loadStatuses()}
          />
        </>
      )}

      <UpdateStatusModal
        isOpen={Boolean(selectedPlatform)}
        platform={selectedPlatform}
        onClose={() => {
          if (!isSaving) {
            setSelectedPlatform(null);
          }
        }}
        onSubmit={handleUpdateStatus}
        isSaving={isSaving}
      />
    </div>
  );
}