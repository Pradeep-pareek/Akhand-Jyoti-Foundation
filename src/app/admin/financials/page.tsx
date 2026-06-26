"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type TabId = "policies" | "fundraising" | "financials";

interface FinancialDocument {
  id: number;
  tabId: TabId;
  year: string;
  title: string;
  subtitle: string;
  filename: string;
  createdAt?: string;
  updatedAt?: string;
}

const TAB_OPTIONS: { id: TabId; label: string }[] = [
  { id: "financials", label: "Our Past Financials" },
  { id: "policies", label: "Policies" },
  { id: "fundraising", label: "Fund Raising Documents" },
];

export default function FinancialsAdminPage() {
  const [items, setItems] = useState<FinancialDocument[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Form state
  const [activeView, setActiveView] = useState<"list" | "add">("list");
  const [editingItem, setEditingItem] = useState<FinancialDocument | null>(null);
  const [tabId, setTabId] = useState<TabId>("financials");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [filterTab, setFilterTab] = useState<TabId | "all">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4500);
  };

  const loadDocs = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/financials");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setItems(json.data as FinancialDocument[]);
    } catch (err) {
      setFetchError(String(err));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const resetForm = () => {
    setTabId("financials");
    setYear("");
    setTitle("");
    setSubtitle("");
    setPdfFile(null);
    setEditingItem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (item: FinancialDocument) => {
    setTabId(item.tabId);
    setYear(item.year);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setPdfFile(null);
    setEditingItem(item);
    setActiveView("add");
  };

  const handleSubmit = async () => {
    if (!year.trim() || !title.trim()) {
      showError("Year and Title are required.");
      return;
    }
    if (!editingItem && !pdfFile) {
      showError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    try {
      let filename = editingItem?.filename ?? "";

      // Upload new PDF if provided
      if (pdfFile) {
        const fd = new FormData();
        fd.append("pdf", pdfFile);
        const uploadRes = await fetch("/api/admin/financials/upload", {
          method: "POST",
          body: fd,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error || "Upload failed");
        filename = uploadJson.filename as string;
      }

      if (editingItem) {
        const putRes = await fetch(`/api/admin/financials/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tabId, year: year.trim(), title: title.trim(), subtitle: subtitle.trim(), filename }),
        });
        const putJson = await putRes.json();
        if (!putJson.success) throw new Error(putJson.error || "Update failed");
        showSuccess("Document updated!");
      } else {
        const postRes = await fetch("/api/admin/financials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tabId, year: year.trim(), title: title.trim(), subtitle: subtitle.trim(), filename }),
        });
        const postJson = await postRes.json();
        if (!postJson.success) throw new Error(postJson.error || "Create failed");
        showSuccess("Document added!");
      }

      await loadDocs();
      resetForm();
      setActiveView("list");
    } catch (err) {
      showError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/financials/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      showSuccess("Document deleted.");
    } catch (err) {
      showError(String(err));
    }
  };

  const filteredItems = filterTab === "all" ? items : items.filter((i) => i.tabId === filterTab);

  return (
    <div className="min-h-screen bg-[#F4F7F0] py-10 px-4">

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#6ab04c] shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error toast */}
      {errorMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-red-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#D4E8C4]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financials <span className="text-[#6ab04c]">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage PDF documents shown on the Financials page
            </p>
          </div>
          <div className="flex gap-1 bg-[#E8F5E2] rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => { setActiveView("add"); if (!editingItem) resetForm(); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeView === "add"
                  ? "bg-[#6ab04c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {editingItem ? "✏️ Editing" : "+ Add Document"}
            </button>
            <button
              onClick={() => setActiveView("list")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeView === "list"
                  ? "bg-[#6ab04c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📄 Documents ({items.length})
            </button>
          </div>
        </div>

        {/* ── ADD / EDIT FORM ── */}
        {activeView === "add" && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-[#D4E8C4] p-8">
            <div className="flex items-center gap-3 mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Document" : "Add Document"}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-widest bg-[#E8F5E2] text-[#4e8a34] px-3 py-1 rounded-full">
                {editingItem ? "Editing" : "New"}
              </span>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-col gap-2">
                {TAB_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                      tabId === opt.id
                        ? "border-[#6ab04c] bg-[#F0FAF0] text-[#2D7A4F] font-semibold"
                        : "border-[#E0EDD8] text-gray-600 hover:border-[#A8D4A8]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tabId"
                      value={opt.id}
                      checked={tabId === opt.id}
                      onChange={() => setTabId(opt.id)}
                      className="accent-[#6ab04c]"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Year / Label <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 bg-[#F4F7F0] border border-[#D4E8C4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                placeholder="e.g. FY 2023–24 or Policy 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Title */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 bg-[#F4F7F0] border border-[#D4E8C4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                placeholder="e.g. Annual Financial Statement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Subtitle */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Subtitle
              </label>
              <input
                className="w-full px-4 py-2.5 bg-[#F4F7F0] border border-[#D4E8C4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                placeholder="e.g. Audited Accounts"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            {/* PDF Upload */}
            <div className="mb-7">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                PDF File {!editingItem && <span className="text-red-400">*</span>}
              </label>

              {editingItem && !pdfFile && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                  Current file: <span className="font-mono">{editingItem.filename}</span>
                  <br />Upload a new PDF below to replace it, or leave empty to keep the current file.
                </div>
              )}

              {pdfFile && (
                <div className="mb-3 flex items-center gap-3 p-3 bg-[#F0FAF0] border border-[#B8E0A2] rounded-lg">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2D7A4F] truncate">{pdfFile.name}</p>
                    <p className="text-xs text-gray-400">{(pdfFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={() => { setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#B8E0A2] rounded-xl text-sm font-semibold text-[#4e8a34] hover:bg-[#E8F5E2] hover:border-[#6ab04c] transition-all duration-200"
              >
                <span className="text-lg leading-none">+</span>
                {pdfFile ? "Replace PDF" : "Upload PDF"}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { resetForm(); setActiveView("list"); }}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !year.trim() || !title.trim()}
                className="flex-1 py-2.5 bg-[#6ab04c] hover:bg-[#4e8a34] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : editingItem ? "✓ Save Changes" : "+ Add Document"}
              </button>
            </div>
          </div>
        )}

        {/* ── DOCUMENT LIST ── */}
        {activeView === "list" && (
          <>
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filterTab === "all"
                      ? "bg-[#6ab04c] text-white border-[#6ab04c]"
                      : "border-[#D4E8C4] text-gray-600 hover:border-[#6ab04c] hover:text-[#4e8a34]"
                  }`}
                >
                  All ({items.length})
                </button>
                {TAB_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilterTab(opt.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      filterTab === opt.id
                        ? "bg-[#6ab04c] text-white border-[#6ab04c]"
                        : "border-[#D4E8C4] text-gray-600 hover:border-[#6ab04c] hover:text-[#4e8a34]"
                    }`}
                  >
                    {opt.label} ({items.filter((i) => i.tabId === opt.id).length})
                  </button>
                ))}
              </div>
              <button
                onClick={loadDocs}
                disabled={isFetching}
                className="text-xs font-semibold text-[#4e8a34] hover:text-[#6ab04c] disabled:opacity-40 transition-all flex items-center gap-1.5"
              >
                {isFetching ? (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : "↻"} Refresh
              </button>
            </div>

            {/* Fetch error */}
            {fetchError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>Failed to load: {fetchError}</span>
                <button onClick={loadDocs} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
              </div>
            )}

            {/* Skeleton */}
            {isFetching && items.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-[#D4E8C4] p-5 animate-pulse">
                    <div className="h-4 bg-[#D4E8C4] rounded w-1/3 mb-3" />
                    <div className="h-5 bg-[#E8F5E2] rounded w-2/3 mb-2" />
                    <div className="h-3 bg-[#E8F5E2] rounded w-full mb-1" />
                    <div className="h-3 bg-[#E8F5E2] rounded w-4/5 mb-5" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-[#D4E8C4] rounded-lg flex-1" />
                      <div className="h-8 bg-[#D4E8C4] rounded-lg flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!isFetching && filteredItems.length === 0 && !fetchError && (
              <div className="text-center py-20 text-gray-400">
                <span className="text-5xl block mb-4">📄</span>
                <p className="text-lg font-semibold text-gray-500">No documents yet</p>
                <p className="text-sm mt-1">Switch to &quot;Add Document&quot; to upload your first entry.</p>
              </div>
            )}

            {/* Document cards */}
            {filteredItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#D4E8C4] p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Category badge */}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#E8F5E2] text-[#4e8a34] mb-3">
                      {TAB_OPTIONS.find((t) => t.id === item.tabId)?.label}
                    </span>

                    <p className="text-sm font-bold text-[#2D7A4F] mb-0.5">{item.year}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 mb-3">{item.subtitle}</p>
                    )}

                    {/* PDF filename */}
                    <div className="flex items-center gap-2 p-2.5 bg-[#F4F7F0] rounded-lg mb-4">
                      <span className="text-base">📄</span>
                      <p className="text-xs text-gray-500 font-mono truncate flex-1">{item.filename}</p>
                      <a
                        href={`/api/financials/pdf/${item.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#2D7A4F] hover:underline shrink-0"
                      >
                        View
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-all"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Document?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This will permanently remove the document and its PDF file. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
