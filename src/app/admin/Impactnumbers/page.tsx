"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type StatItem = {
  id: number;
  value: number;
  label: string;
  icon: string;
};

// Local draft state per card
type DraftMap = Record<number, { value: string; label: string }>;

export default function ImpactNumbersAdmin() {
  const [stats, setStats]       = useState<StatItem[]>([]);
  const [drafts, setDrafts]     = useState<DraftMap>({});
  const [dirty, setDirty]       = useState<Set<number>>(new Set());
  const [saving, setSaving]     = useState<Set<number>>(new Set());
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/impact-numbers");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      const data: StatItem[] = json.data;
      setStats(data);
      // Seed drafts from server values
      const initial: DraftMap = {};
      data.forEach((s) => { initial[s.id] = { value: String(s.value), label: s.label }; });
      setDrafts(initial);
      setDirty(new Set());
    } catch (err) {
      setFetchError(String(err));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  // ── Draft change ─────────────────────────────────────────────────────────────
  const handleChange = (id: number, field: "value" | "label", val: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
    setDirty((prev) => new Set(prev).add(id));
  };

  // ── Save single card ─────────────────────────────────────────────────────────
  const handleSave = async (id: number) => {
    const draft = drafts[id];
    const numVal = Number(draft.value);
    if (isNaN(numVal) || numVal < 0) {
      showToast("Value must be a valid positive number.", "error");
      return;
    }
    if (!draft.label.trim()) {
      showToast("Label cannot be empty.", "error");
      return;
    }

    setSaving((prev) => new Set(prev).add(id));
    try {
      const res = await fetch("/api/admin/impact-numbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value: numVal, label: draft.label.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Update local state
      setStats((prev) => prev.map((s) => s.id === id ? { ...s, value: numVal, label: draft.label.trim().toUpperCase() } : s));
      setDirty((prev) => { const n = new Set(prev); n.delete(id); return n; });
      showToast("Saved successfully!");
    } catch (err) {
      showToast(String(err), "error");
    } finally {
      setSaving((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  // ── Discard single card ──────────────────────────────────────────────────────
  const handleDiscard = (id: number) => {
    const original = stats.find((s) => s.id === id);
    if (!original) return;
    setDrafts((prev) => ({ ...prev, [id]: { value: String(original.value), label: original.label } }));
    setDirty((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  // ── Save all dirty at once ───────────────────────────────────────────────────
  const handleSaveAll = async () => {
    const dirtyIds = Array.from(dirty);
    if (dirtyIds.length === 0) return;

    // Validate all
    for (const id of dirtyIds) {
      const d = drafts[id];
      if (isNaN(Number(d.value)) || Number(d.value) < 0) {
        showToast(`Invalid value for "${d.label}"`, "error");
        return;
      }
    }

    setSaving(new Set(dirtyIds));
    try {
      // Build full updated array for bulk PUT
      const updated: StatItem[] = stats.map((s) => ({
        ...s,
        value: dirtyIds.includes(s.id) ? Number(drafts[s.id].value) : s.value,
        label: dirtyIds.includes(s.id) ? drafts[s.id].label.trim().toUpperCase() : s.label,
      }));

      const res = await fetch("/api/admin/impact-numbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: updated }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setStats(updated);
      setDirty(new Set());
      showToast(`${dirtyIds.length} item${dirtyIds.length > 1 ? "s" : ""} saved!`);
    } catch (err) {
      showToast(String(err), "error");
    } finally {
      setSaving(new Set());
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f7f0] py-10 px-4">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl transition-all ${
          toast.type === "success" ? "bg-gray-900" : "bg-red-600"
        }`}>
          <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${toast.type === "success" ? "bg-[#6ab04c]" : "bg-white"}`} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#d4e8c4]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Impact <span className="text-[#6ab04c]">Numbers</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Edit the stats shown on the homepage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              disabled={isFetching}
              className="text-xs font-semibold text-[#4e8a34] hover:text-[#6ab04c] disabled:opacity-40 flex items-center gap-1.5 transition-all"
            >
              {isFetching ? (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : "↻"} Refresh
            </button>
            {dirty.size > 0 && (
              <button
                onClick={handleSaveAll}
                disabled={saving.size > 0}
                className="px-5 py-2 bg-[#6ab04c] hover:bg-[#4e8a34] disabled:opacity-50 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                {saving.size > 0 ? (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : "✓"} Save All ({dirty.size})
              </button>
            )}
          </div>
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-3">
            <span>⚠️</span>
            <span>Failed to load: {fetchError}</span>
            <button onClick={loadStats} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {isFetching && stats.length === 0 && (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#d4e8c4] p-5 animate-pulse">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#e8f5e2]" />
                </div>
                <div className="h-5 bg-[#e8f5e2] rounded w-2/3 mx-auto mb-3" />
                <div className="h-4 bg-[#f0f8e8] rounded w-full mb-2" />
                <div className="h-4 bg-[#f0f8e8] rounded w-4/5 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Cards — row 1: first 4 */}
        {!isFetching && stats.length > 0 && (
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              {stats.slice(0, 4).map((item) => (
                <EditCard
                  key={item.id}
                  item={item}
                  draft={drafts[item.id] ?? { value: String(item.value), label: item.label }}
                  isDirty={dirty.has(item.id)}
                  isSaving={saving.has(item.id)}
                  onChange={handleChange}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              ))}
            </div>

            {/* Cards — row 2: last 3 */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
              {stats.slice(4).map((item) => (
                <EditCard
                  key={item.id}
                  item={item}
                  draft={drafts[item.id] ?? { value: String(item.value), label: item.label }}
                  isDirty={dirty.has(item.id)}
                  isSaving={saving.has(item.id)}
                  onChange={handleChange}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              ))}
            </div>

            {/* Info footer */}
            <p className="text-xs text-gray-400 text-center mt-8">
              Changes save directly to the homepage. Unsaved changes are highlighted in{" "}
              <span className="text-amber-500 font-semibold">amber</span>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EditCard ────────────────────────────────────────────────────────────────

type EditCardProps = {
  item: StatItem;
  draft: { value: string; label: string };
  isDirty: boolean;
  isSaving: boolean;
  onChange: (id: number, field: "value" | "label", val: string) => void;
  onSave: (id: number) => void;
  onDiscard: (id: number) => void;
};

function EditCard({ item, draft, isDirty, isSaving, onChange, onSave, onDiscard }: EditCardProps) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 ${
      isDirty ? "border-amber-300 shadow-amber-100 shadow-md" : "border-[#d4e8c4] hover:shadow-md"
    }`}>
      {/* Dirty indicator strip */}
      <div className={`h-1 w-full transition-all duration-300 ${isDirty ? "bg-amber-400" : "bg-transparent"}`} />

      <div className="p-5">
        {/* Icon + preview value */}
        <div className="flex flex-col items-center mb-5">
          <div className="bg-[#81BA45]/20 rounded-full p-3 flex items-center justify-center mb-3">
            <Image
              src={item.icon}
              alt={item.label}
              width={40}
              height={40}
              className="z-10 relative"
            />
          </div>
          {/* Live preview of what will show on homepage */}
          <p className="text-2xl font-bold text-gray-900">
            {draft.value || "0"}+
          </p>
          <p className="text-xs text-gray-400 mt-0.5 text-center leading-tight">
            {draft.label || "—"}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Number Value
            </label>
            <input
              type="number"
              min={0}
              value={draft.value}
              onChange={(e) => onChange(item.id, "value", e.target.value)}
              className="w-full px-3 py-2 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Label
            </label>
            <input
              type="text"
              value={draft.label}
              onChange={(e) => onChange(item.id, "label", e.target.value)}
              className="w-full px-3 py-2 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Action buttons — only show when dirty */}
        {isDirty && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onDiscard(item.id)}
              disabled={isSaving}
              className="flex-1 py-1.5 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 transition-all"
            >
              Discard
            </button>
            <button
              onClick={() => onSave(item.id)}
              disabled={isSaving}
              className="flex-1 py-1.5 text-xs font-semibold bg-[#6ab04c] hover:bg-[#4e8a34] text-white rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1"
            >
              {isSaving ? (
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : "✓"} Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}