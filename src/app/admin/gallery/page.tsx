"use client";

import { RichTextEditor } from "@/app/components/RichTextEditor";
import { useState, useRef, useEffect, useCallback } from "react";

type ImageEntry = {
  file: File;
  preview: string;
  id: string;
};

type GalleryItem = {
  id: number;
  title: string;
  eventDate: string | null;
  description: string;
  images: string[]; // full URLs: /api/gallery/image/<filename>
  createdAt?: string;
  updatedAt?: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [viewItem, setViewItem] = useState<GalleryItem | null>(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"add" | "list">("list");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // ─── Fetch all items on mount ────────────────────────────────────────────────

  const loadGallery = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setItems(json.data as GalleryItem[]);
    } catch (err) {
      setFetchError(String(err));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // ─── File input ──────────────────────────────────────────────────────────────

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newEntries: ImageEntry[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`,
    }));
    setImageEntries((prev) => [...prev, ...newEntries]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImageEntry = (id: string) => {
    setImageEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter((e) => e.id !== id);
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageEntries([]);
    setEditingItem(null);
  };

  // ─── Submit (Create or Update) ───────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      let uploadedFilenames: string[] = [];

      // 1. Upload new images if any
      if (imageEntries.length > 0) {
        const formData = new FormData();
        imageEntries.forEach((entry) => formData.append("images", entry.file));

        const uploadRes = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error || "Upload failed");
        uploadedFilenames = uploadJson.filenames as string[];
      }

      if (editingItem) {
        // 2a. Update existing item
        const body: Record<string, unknown> = {
          title: title.trim(),
          description: description.trim(),
          eventDate: eventDate || null,
        };
        // Only replace images if new ones were uploaded
        if (uploadedFilenames.length > 0) {
          body.images = uploadedFilenames;
        }

        const putRes = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const putJson = await putRes.json();
        if (!putJson.success) throw new Error(putJson.error || "Update failed");

        // Refresh from server to get accurate image URLs
        await loadGallery();
        showSuccess("Gallery item updated!");
      } else {
        // 2b. Create new item
        const postRes = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            images: uploadedFilenames,
            eventDate: eventDate || null,
          }),
        });
        const postJson = await postRes.json();
        if (!postJson.success) throw new Error(postJson.error || "Create failed");

        await loadGallery();
        showSuccess("Gallery item added!");
      }

      resetForm();
      setActiveTab("list");
    } catch (err) {
      showError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Edit ────────────────────────────────────────────────────────────────────

  const handleEdit = (item: GalleryItem) => {
    setTitle(item.title);
    setDescription(item.description);
    setEventDate(item.eventDate || "");
    setImageEntries([]);
    setEditingItem(item);
    setActiveTab("add");
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      showSuccess("Gallery item deleted.");
    } catch (err) {
      showError(String(err));
    }
  };

  const cancelForm = () => {
    resetForm();
    setActiveTab("list");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f4f7f0] py-10 px-4">

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#6ab04c] inline-block shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error Toast */}
      {errorMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-red-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-white inline-block shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#d4e8c4]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gallery <span className="text-[#6ab04c]">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage photos from AJF's programs
            </p>
          </div>
          <div className="flex gap-1 bg-[#e8f5e2] rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => { setActiveTab("add"); if (!editingItem) resetForm(); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === "add"
                ? "bg-[#6ab04c] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {editingItem ? "✏️ Editing" : "+ Add Item"}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === "list"
                ? "bg-[#6ab04c] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              🖼 Gallery ({items.length})
            </button>
          </div>
        </div>

        {/* ── ADD / EDIT FORM ── */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#d4e8c4] p-8">
            <div className="flex items-center gap-3 mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-widest bg-[#e8f5e2] text-[#4e8a34] px-3 py-1 rounded-full">
                {editingItem ? "Editing" : "New"}
              </span>
            </div>

            {/* Title */}
            <div className="mb-5 grid grid-cols-12 gap-3">
              <div className="col-span-9">

                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                  placeholder="e.g. Skill Development Workshop 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-span-3">

                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Event Date <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                  placeholder="e.g. Skill Development Workshop 2024"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  type="date"
                />
              </div>
            </div>

            {/* Description */}
            <RichTextEditor
              value={description}
              onChange={(val) => setDescription(val)}
              placeholder="Describe what this gallery item represents…"
            />

            {/* Images Upload */}
            <div className="mb-7">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Images
              </label>

              {/* Existing images hint when editing */}
              {editingItem && editingItem.images.length > 0 && imageEntries.length === 0 && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                  ⚠️ {editingItem.images.length} existing image{editingItem.images.length > 1 ? "s" : ""} on server. Upload new ones below to replace them, or leave empty to keep current.
                </div>
              )}

              {/* Existing image thumbnails when editing */}
              {editingItem && editingItem.images.length > 0 && imageEntries.length === 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {editingItem.images.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-[#d4e8c4] aspect-square bg-[#f4f7f0]">
                      <img src={url} alt="existing" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 text-center">
                        Current
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New image previews */}
              {imageEntries.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {imageEntries.map((entry) => (
                    <div key={entry.id} className="relative group rounded-xl overflow-hidden border border-[#d4e8c4] aspect-square bg-[#f4f7f0]">
                      <img src={entry.preview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImageEntry(entry.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 truncate">
                        {entry.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileAdd}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#b8e0a2] rounded-xl text-sm font-semibold text-[#4e8a34] hover:bg-[#e8f5e2] hover:border-[#6ab04c] transition-all duration-200"
              >
                <span className="text-lg leading-none">+</span>
                {imageEntries.length === 0 ? "Upload Images" : "Add More Images"}
              </button>
              {imageEntries.length > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {imageEntries.length} image{imageEntries.length > 1 ? "s" : ""} selected · Hover to remove
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelForm}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || loading}
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
                ) : editingItem ? "✓ Save Changes" : "+ Add to Gallery"}
              </button>
            </div>
          </div>
        )}

        {/* ── GALLERY LIST ── */}
        {activeTab === "list" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{items.length}</span> items in gallery
              </p>
              <button
                onClick={loadGallery}
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
                <span>Failed to load gallery: {fetchError}</span>
                <button onClick={loadGallery} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
              </div>
            )}

            {/* Loading skeleton */}
            {isFetching && items.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-[#d4e8c4] overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-[#e8f5e2]" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-[#d4e8c4] rounded w-2/3" />
                      <div className="h-3 bg-[#e8f5e2] rounded w-full" />
                      <div className="h-3 bg-[#e8f5e2] rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isFetching && items.length === 0 && !fetchError && (
              <div className="text-center py-20 text-gray-400">
                <span className="text-5xl block mb-4">🖼</span>
                <p className="text-lg font-semibold text-gray-500">No gallery items yet</p>
                <p className="text-sm mt-1">Switch to "Add Item" to upload your first entry.</p>
              </div>
            )}

            {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#d4e8c4] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                  >
                    <div className="h-48 overflow-hidden bg-[#e8f5e2] relative">
                      {item.images.length > 0 ? (
                        <>
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.images.length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                              +{item.images.length - 1} more
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-[#6ab04c]">🏞</div>
                      )}
                    </div>

                    <div className="px-4 pt-4 pb-3">
                      <h3 className="font-bold text-gray-900 text-base truncate mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[32px]">
                        {item.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex gap-2 px-4 pb-4">
                      <button
                        onClick={() => { setViewItem(item); setViewImageIndex(0); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg border border-[#b8e0a2] text-[#4e8a34] bg-white hover:bg-[#e8f5e2] transition-all"
                      >
                        👁 View
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-all"
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

      {/* ── VIEW MODAL ── */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 bg-[#e8f5e2]">
              {viewItem.images.length > 0 ? (
                <img
                  src={viewItem.images[viewImageIndex]}
                  alt={viewItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-[#6ab04c]">🏞</div>
              )}

              {viewItem.images.length > 1 && (
                <>
                  <button
                    onClick={() => setViewImageIndex((i) => (i - 1 + viewItem.images.length) % viewItem.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  >‹</button>
                  <button
                    onClick={() => setViewImageIndex((i) => (i + 1) % viewItem.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  >›</button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {viewItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setViewImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === viewImageIndex ? "bg-white scale-125" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {viewItem.images.length > 1 && (
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {viewImageIndex + 1} / {viewItem.images.length}
                </span>
              )}
            </div>

            {viewItem.images.length > 1 && (
              <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
                {viewItem.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setViewImageIndex(idx)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === viewImageIndex ? "border-[#6ab04c]" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 pt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{viewItem.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{viewItem.description || "No description provided."}</p>
              {viewItem.updatedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  Last updated: {new Date(viewItem.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setViewItem(null)}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:opacity-80 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => { handleEdit(viewItem); setViewItem(null); }}
                className="flex-1 py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all"
              >
                ✏️ Edit This Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This will permanently remove the gallery item and all its images. This cannot be undone.
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