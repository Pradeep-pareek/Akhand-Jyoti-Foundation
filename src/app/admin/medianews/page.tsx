"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MediaNewsItem = {
  id: number;
  title: string;
  description: string;
  image: string; // full URL: /api/gallery/image/<filename>
  link: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function MediaNewsAdminPage() {
  const [items, setItems] = useState<MediaNewsItem[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<{ file: File; preview: string } | null>(null);
  const [editingItem, setEditingItem] = useState<MediaNewsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"add" | "list">("list");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const loadItems = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/medianews");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setItems(json.data as MediaNewsItem[]);
    } catch (err) {
      setFetchError(String(err));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageFile) URL.revokeObjectURL(imageFile.preview);
    setImageFile({ file, preview: URL.createObjectURL(file) });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    if (imageFile) URL.revokeObjectURL(imageFile.preview);
    setImageFile(null);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      let uploadedFilename = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("images", imageFile.file);
        const uploadRes = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error || "Upload failed");
        uploadedFilename = uploadJson.filenames[0] as string;
      }

      if (editingItem) {
        const body: Record<string, unknown> = {
          title: title.trim(),
          description: description.trim(),
          link: link.trim(),
        };
        if (uploadedFilename) body.image = uploadedFilename;

        const putRes = await fetch(`/api/admin/medianews/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const putJson = await putRes.json();
        if (!putJson.success) throw new Error(putJson.error || "Update failed");

        await loadItems();
        showSuccess("Media news item updated!");
      } else {
        const postRes = await fetch("/api/admin/medianews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            image: uploadedFilename,
            link: link.trim(),
          }),
        });
        const postJson = await postRes.json();
        if (!postJson.success) throw new Error(postJson.error || "Create failed");

        await loadItems();
        showSuccess("Media news item added!");
      }

      resetForm();
      setActiveTab("list");
    } catch (err) {
      showError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MediaNewsItem) => {
    setTitle(item.title);
    setDescription(item.description);
    setLink(item.link || "");
    if (imageFile) URL.revokeObjectURL(imageFile.preview);
    setImageFile(null);
    setEditingItem(item);
    setActiveTab("add");
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/medianews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      showSuccess("Item deleted.");
    } catch (err) {
      showError(String(err));
    }
  };

  const cancelForm = () => {
    resetForm();
    setActiveTab("list");
  };

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
              Media Coverage <span className="text-[#6ab04c]">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage news items displayed in the Media Coverage section on the home page
            </p>
          </div>
          <div className="flex gap-1 bg-[#e8f5e2] rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => { setActiveTab("add"); if (!editingItem) resetForm(); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "add"
                  ? "bg-[#6ab04c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {editingItem ? "✏️ Editing" : "+ Add Item"}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "list"
                  ? "bg-[#6ab04c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📰 News ({items.length})
            </button>
          </div>
        </div>

        {/* ── ADD / EDIT FORM ── */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#d4e8c4] p-8">
            <div className="flex items-center gap-3 mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit News Item" : "Add News Item"}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-widest bg-[#e8f5e2] text-[#4e8a34] px-3 py-1 rounded-full">
                {editingItem ? "Editing" : "New"}
              </span>
            </div>

            {/* Title */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                placeholder="e.g. Sanitation Workers Training Program Begins"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all resize-none"
                placeholder="Describe this news coverage…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Link */}
            <div className="mb-7">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Button Link
              </label>
              <input
                className="w-full px-4 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                placeholder="e.g. /about-us or https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-7">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Image
              </label>

              {/* Existing image hint when editing */}
              {editingItem && editingItem.image && !imageFile && (
                <div className="mb-3">
                  <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                    ⚠️ Current image shown below. Upload a new one to replace it, or leave empty to keep it.
                  </p>
                  <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-[#d4e8c4] aspect-video bg-[#f4f7f0]">
                    <img src={editingItem.image} alt="current" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 text-center">
                      Current
                    </div>
                  </div>
                </div>
              )}

              {/* New image preview */}
              {imageFile && (
                <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-[#d4e8c4] aspect-video bg-[#f4f7f0] mb-3 group">
                  <img src={imageFile.preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(imageFile.preview);
                      setImageFile(null);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 truncate">
                    {imageFile.file.name}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#b8e0a2] rounded-xl text-sm font-semibold text-[#4e8a34] hover:bg-[#e8f5e2] hover:border-[#6ab04c] transition-all duration-200"
              >
                <span className="text-lg leading-none">+</span>
                {imageFile ? "Replace Image" : "Upload Image"}
              </button>
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
                ) : editingItem ? "✓ Save Changes" : "+ Add News Item"}
              </button>
            </div>
          </div>
        )}

        {/* ── NEWS LIST ── */}
        {activeTab === "list" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{items.length}</span> news items
              </p>
              <button
                onClick={loadItems}
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

            {fetchError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>Failed to load items: {fetchError}</span>
                <button onClick={loadItems} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
              </div>
            )}

            {isFetching && items.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-[#d4e8c4] overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 bg-[#e8f5e2]" />
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
                <span className="text-5xl block mb-4">📰</span>
                <p className="text-lg font-semibold text-gray-500">No news items yet</p>
                <p className="text-sm mt-1">Switch to &quot;Add Item&quot; to create your first entry.</p>
              </div>
            )}

            {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#d4e8c4] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                  >
                    <div className="h-40 overflow-hidden bg-[#e8f5e2]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-[#6ab04c]">📰</div>
                      )}
                    </div>

                    <div className="px-4 pt-4 pb-3">
                      <h3 className="font-bold text-gray-900 text-base truncate mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[32px]">
                        {item.description || "No description provided."}
                      </p>
                      {item.link && (
                        <p className="text-xs text-[#6ab04c] truncate mt-1">🔗 {item.link}</p>
                      )}
                    </div>

                    <div className="flex gap-2 px-4 pb-4">
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
              This will permanently remove this news item and its image. This cannot be undone.
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
