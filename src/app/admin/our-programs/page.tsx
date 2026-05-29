"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Check, Pencil, X, Upload, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IoclSection {
    badge: string;
    heading: string;
    description: string;
    outcome_text: string;
    outcome_icon: string;
    section_image: string;
    cta_label: string;
    cta_href: string;
}

export interface SlumSection {
    badge: string;
    heading: string;
    description: string;
    card1_title: string;
    card1_text: string;
    card2_title: string;
    card2_text: string;
    section_image: string;
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
}

export interface ArtsTag {
    emoji: string;
    label: string;
}

export interface ArtsSection {
    badge: string;
    heading: string;
    description1: string;
    description2: string;
    section_image: string;
    tags: ArtsTag[];
}

export interface SensitizingSection {
    heading: string;
    description1: string;
    description2: string;
    cta_label: string;
    cta_href: string;
    images: string[];  // array of image URLs
}

type SectionKey = "iocl_section" | "slum_section" | "arts_section" | "sensitizing_section";
type SectionData = IoclSection | SlumSection | ArtsSection | SensitizingSection;

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all
            ${type === "success" ? "bg-[#2D7A4F]" : "bg-red-600"}`}>
            {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message}
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
    );
}

// ─── Image Upload Helper ──────────────────────────────────────────────────────

async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("images", file);
    const res = await fetch("/api/admin/gallery/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!json.success) throw new Error("Upload failed");
    return json.urls[0] as string;
}

// ─── Image Picker ─────────────────────────────────────────────────────────────

function ImagePicker({
    value,
    onChange,
    label,
}: {
    value: string;
    onChange: (url: string) => void;
    label: string;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch {
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <div className="relative border-2 border-dashed border-[#81BA45] rounded-xl overflow-hidden bg-[#f6fbf0]">
                {value && (
                    <div className="relative w-full h-40">
                        <img src={value} alt="preview" className="w-full h-full object-cover" />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[#2D7A4F] font-semibold text-sm hover:bg-[#e8f5ed] transition-colors"
                >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? "Uploading…" : value ? "Change Image" : "Upload Image"}
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="or paste URL"
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#81BA45]"
            />
        </div>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal<T extends SectionData>({
    section,
    data,
    onClose,
    onSave,
}: {
    section: SectionKey;
    data: T;
    onClose: () => void;
    onSave: (updated: T) => Promise<void>;
}) {
    const [form, setForm] = useState<T>(JSON.parse(JSON.stringify(data)));
    const [saving, setSaving] = useState(false);

    const set = (key: string, value: unknown) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const renderFields = () => {
        if (section === "iocl_section") {
            const f = form as IoclSection;
            return (
                <div className="space-y-4">
                    <Field label="Badge" value={f.badge} onChange={(v) => set("badge", v)} />
                    <Field label="Heading" value={f.heading} onChange={(v) => set("heading", v)} textarea />
                    <Field label="Description" value={f.description} onChange={(v) => set("description", v)} textarea />
                    <Field label="Outcome Text" value={f.outcome_text} onChange={(v) => set("outcome_text", v)} textarea />
                    <Field label="CTA Label" value={f.cta_label} onChange={(v) => set("cta_label", v)} />
                    <Field label="CTA Link" value={f.cta_href} onChange={(v) => set("cta_href", v)} />
                    <ImagePicker label="Section Image" value={f.section_image} onChange={(v) => set("section_image", v)} />
                    <ImagePicker label="Outcome Icon" value={f.outcome_icon} onChange={(v) => set("outcome_icon", v)} />
                </div>
            );
        }

        if (section === "slum_section") {
            const f = form as SlumSection;
            return (
                <div className="space-y-4">
                    <Field label="Badge" value={f.badge} onChange={(v) => set("badge", v)} />
                    <Field label="Heading" value={f.heading} onChange={(v) => set("heading", v)} textarea />
                    <Field label="Description" value={f.description} onChange={(v) => set("description", v)} textarea />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Card 1 Title" value={f.card1_title} onChange={(v) => set("card1_title", v)} />
                        <Field label="Card 1 Text" value={f.card1_text} onChange={(v) => set("card1_text", v)} textarea />
                        <Field label="Card 2 Title" value={f.card2_title} onChange={(v) => set("card2_title", v)} />
                        <Field label="Card 2 Text" value={f.card2_text} onChange={(v) => set("card2_text", v)} textarea />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Stat 1 Value" value={f.stat1_value} onChange={(v) => set("stat1_value", v)} />
                        <Field label="Stat 1 Label" value={f.stat1_label} onChange={(v) => set("stat1_label", v)} />
                        <div />
                        <Field label="Stat 2 Value" value={f.stat2_value} onChange={(v) => set("stat2_value", v)} />
                        <Field label="Stat 2 Label" value={f.stat2_label} onChange={(v) => set("stat2_label", v)} />
                        <div />
                        <Field label="Stat 3 Value" value={f.stat3_value} onChange={(v) => set("stat3_value", v)} />
                        <Field label="Stat 3 Label" value={f.stat3_label} onChange={(v) => set("stat3_label", v)} />
                    </div>
                    <ImagePicker label="Section Image" value={f.section_image} onChange={(v) => set("section_image", v)} />
                </div>
            );
        }

        if (section === "arts_section") {
            const f = form as ArtsSection;
            return (
                <div className="space-y-4">
                    <Field label="Badge" value={f.badge} onChange={(v) => set("badge", v)} />
                    <Field label="Heading" value={f.heading} onChange={(v) => set("heading", v)} textarea />
                    <Field label="Description 1" value={f.description1} onChange={(v) => set("description1", v)} textarea />
                    <Field label="Description 2" value={f.description2} onChange={(v) => set("description2", v)} textarea />
                    <ImagePicker label="Section Image" value={f.section_image} onChange={(v) => set("section_image", v)} />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</label>
                        <div className="mt-2 space-y-2">
                            {f.tags.map((tag, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={tag.emoji}
                                        onChange={(e) => {
                                            const tags = [...f.tags];
                                            tags[i] = { ...tags[i], emoji: e.target.value };
                                            set("tags", tags);
                                        }}
                                        className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-base focus:outline-none focus:ring-2 focus:ring-[#81BA45]"
                                        placeholder="Emoji"
                                    />
                                    <input
                                        type="text"
                                        value={tag.label}
                                        onChange={(e) => {
                                            const tags = [...f.tags];
                                            tags[i] = { ...tags[i], label: e.target.value };
                                            set("tags", tags);
                                        }}
                                        className="flex-1 border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#81BA45]"
                                        placeholder="Label"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => set("tags", f.tags.filter((_, idx) => idx !== i))}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => set("tags", [...f.tags, { emoji: "⭐", label: "New Tag" }])}
                                className="text-[#2D7A4F] text-sm font-semibold hover:underline"
                            >
                                + Add Tag
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (section === "sensitizing_section") {
            const f = form as SensitizingSection;
            return (
                <div className="space-y-4">
                    <Field label="Heading" value={f.heading} onChange={(v) => set("heading", v)} textarea />
                    <Field label="Description 1" value={f.description1} onChange={(v) => set("description1", v)} textarea />
                    <Field label="Description 2" value={f.description2} onChange={(v) => set("description2", v)} textarea />
                    <Field label="CTA Label" value={f.cta_label} onChange={(v) => set("cta_label", v)} />
                    <Field label="CTA Link" value={f.cta_href} onChange={(v) => set("cta_href", v)} />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slideshow Images</label>
                        <div className="mt-2 space-y-3">
                            {f.images.map((img, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <ImagePicker
                                            label={`Image ${i + 1}`}
                                            value={img}
                                            onChange={(v) => {
                                                const imgs = [...f.images];
                                                imgs[i] = v;
                                                set("images", imgs);
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => set("images", f.images.filter((_, idx) => idx !== i))}
                                        className="mt-6 text-red-400 hover:text-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => set("images", [...f.images, ""])}
                                className="text-[#2D7A4F] text-sm font-semibold hover:underline"
                            >
                                + Add Image
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const sectionLabels: Record<SectionKey, string> = {
        iocl_section: "NIPUN Programme Section",
        slum_section: "Slum Development Section",
        arts_section: "Arts & Culture Section",
        sensitizing_section: "Sensitizing Society Section",
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F5ED] flex items-center justify-center">
                            <Pencil size={15} className="text-[#2D7A4F]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Edit Section</h3>
                            <p className="text-xs text-gray-400">{sectionLabels[section]}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5 flex-1">
                    {renderFields()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#2D7A4F] text-white text-sm font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
    label,
    value,
    onChange,
    textarea,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    textarea?: boolean;
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#81BA45] resize-none"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#81BA45]"
                />
            )}
        </div>
    );
}

// ─── Edit Overlay Button ──────────────────────────────────────────────────────

function EditOverlay({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white border border-[#81BA45] text-[#2D7A4F] text-xs font-bold px-3 py-1.5 rounded-full shadow-md hover:bg-[#81BA45] hover:text-white transition-all duration-200 group"
        >
            <Pencil size={12} className="group-hover:rotate-12 transition-transform" />
            {label}
        </button>
    );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function EditableSection({
    onEdit,
    label,
    children,
    className = "",
}: {
    onEdit: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative group ${className}`}>
            {/* Highlight border on hover */}
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#81BA45]/40 rounded-sm pointer-events-none transition-all z-10" />
            <EditOverlay onClick={onEdit} label={`Edit ${label}`} />
            {children}
        </div>
    );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminHomePage() {
    const [sections, setSections] = useState<Record<string, SectionData> | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") =>
        setToast({ message, type });

    const dismissToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        fetch("/api/our-programs")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setSections(json.sections);
                else showToast("Failed to load content", "error");
            })
            .catch(() => showToast("Failed to load content", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async <T extends SectionData>(section: SectionKey, updated: T) => {
        const res = await fetch(`/api/admin/our-programs/${section}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        });
        const json = await res.json();
        if (json.success) {
            setSections((prev) => prev ? { ...prev, [section]: updated } : prev);
            showToast("Section saved successfully!", "success");
        } else {
            throw new Error("Save failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={36} className="animate-spin text-[#81BA45]" />
                    <p className="text-gray-500 font-medium">Loading homepage content…</p>
                </div>
            </div>
        );
    }

    if (!sections) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-red-500">
                    <AlertCircle size={36} />
                    <p className="font-medium">Could not load content. Check your database connection.</p>
                </div>
            </div>
        );
    }

    const iocl = sections["iocl_section"] as IoclSection;
    const slum = sections["slum_section"] as SlumSection;
    const arts = sections["arts_section"] as ArtsSection;
    const sensitizing = sections["sensitizing_section"] as SensitizingSection;

    return (
        <>

            <EditableSection
                onEdit={() => setEditingSection("sensitizing_section")}
                label="Sensitizing Section"
                className="bg-[#E6EBDB]"
            >
                <section className="bg-[#E6EBDB] lg:py-16 py-10 mt-10">
                    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
                            <div className="w-full flex items-center justify-center">
                                <div className="relative w-full max-w-[600px] h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-lg bg-gray-100">
                                    {sensitizing.images.length > 0 && (
                                        <img
                                            src={sensitizing.images[0]}
                                            alt="society image"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {sensitizing.images.length > 1 && (
                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                                            {sensitizing.images.map((_, i) => (
                                                <span key={i} className="w-2 h-2 rounded-full bg-white/80" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold">
                                    {sensitizing.heading}
                                </h2>
                                <div className="space-y-1">
                                    <p className="text-black">{sensitizing.description1}</p>
                                    <p className="text-black">{sensitizing.description2}</p>
                                </div>
                                <a
                                    href={sensitizing.cta_href}
                                    className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold">
                                    {sensitizing.cta_label}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </EditableSection>
            {/* ─── IOCL Section ───────────────────────────────────────────── */}
            <EditableSection
                onEdit={() => setEditingSection("iocl_section")}
                label="NIPUN Section"
                className="bg-white"
            >
                <section className="bg-white lg:py-16 py-10">
                    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="text-line-main flex items-center gap-2">
                                        <span className="w-[20px] h-[2px] bg-[#81BA45] inline-block"></span>
                                        <h4 className="text-[#81BA45] font-semibold">{iocl.badge}</h4>
                                    </div>
                                    <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                        {iocl.heading}
                                    </h2>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        {iocl.description}
                                    </p>
                                    <div className="bg-[#E8F5ED] border border-[#2D7A4F] rounded-[12px] py-6 px-6 flex gap-4 items-center">
                                        <img src={iocl.outcome_icon} alt="outcome icon" width={80} height={80} className="shrink-0" />
                                        <p className="text-[#2D7A4F] text-base">
                                            <span className="font-bold">Outcome:</span> {iocl.outcome_text}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={iocl.cta_href}
                                    className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold"
                                >
                                    {iocl.cta_label}
                                </a>
                            </div>
                            <div>
                                <img src={iocl.section_image} alt="section" className="w-full mx-auto" />
                            </div>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Slum Development Section ────────────────────────────────── */}
            <EditableSection
                onEdit={() => setEditingSection("slum_section")}
                label="Slum Section"
            >
                <section
                    className="bg-cover bg-center lg:py-16 py-10"
                    style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}
                >
                    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 items-stretch">
                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-[30px] h-[2px] bg-white"></span>
                                        <p className="text-lg font-normal text-white">{slum.badge}</p>
                                    </div>
                                    <div className="space-y-3 mt-3">
                                        <h2 className="text-white lg:text-4xl md:text-3xl text-2xl font-bold leading-snug">
                                            {slum.heading}
                                        </h2>
                                        <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed">
                                            {slum.description}
                                        </p>
                                        <div className="space-y-4 mt-4">
                                            <div className="bg-[#D2FFE3] rounded-[12px] py-4 px-4">
                                                <h5 className="text-[#2D7A4F] text-lg font-semibold">{slum.card1_title}</h5>
                                                <p className="text-black text-sm">{slum.card1_text}</p>
                                            </div>
                                            <div className="bg-[#E8F5ED] rounded-[12px] py-4 px-4">
                                                <h5 className="text-[#2D7A4F] text-lg font-semibold">{slum.card2_title}</h5>
                                                <p className="text-black text-sm">{slum.card2_text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full">
                                <div className="relative w-full flex-1 min-h-[250px]">
                                    <img
                                        src={slum.section_image}
                                        alt="Slum Development"
                                        className="w-full h-full object-cover rounded-[12px]"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {[
                                        { v: slum.stat1_value, l: slum.stat1_label },
                                        { v: slum.stat2_value, l: slum.stat2_label },
                                        { v: slum.stat3_value, l: slum.stat3_label },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                                            <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">{s.v}</h4>
                                            <p className="text-black text-center text-sm md:text-base">{s.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Arts & Culture Section ──────────────────────────────────── */}
            <EditableSection
                onEdit={() => setEditingSection("arts_section")}
                label="Arts Section"
                className="bg-white"
            >
                <section className="bg-white lg:py-16 py-10">
                    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                            <div>
                                <img src={arts.section_image} alt="Arts Culture" className="w-full mx-auto" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-[20px] h-[3px] bg-[#2D7A4F]"></span>
                                    <p className="text-[#2D7A4F] font-semibold text-base">{arts.badge}</p>
                                </div>
                                <div className="space-y-2 mt-2">
                                    <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                        {arts.heading}
                                    </h2>
                                    <div>
                                        <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                            {arts.description1}
                                        </p>
                                        <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                            {arts.description2}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                                    {arts.tags.map((tag, i) => (
                                        <div
                                            key={i}
                                            className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2"
                                        >
                                            <span>{tag.emoji}</span>
                                            <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">{tag.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Edit Modal ──────────────────────────────────────────────── */}
            {editingSection && sections[editingSection] && (
                <EditModal
                    section={editingSection}
                    data={sections[editingSection] as SectionData}
                    onClose={() => setEditingSection(null)}
                    onSave={(updated) => handleSave(editingSection, updated)}
                />
            )}

            {/* ─── Toast ───────────────────────────────────────────────────── */}
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
            )}
        </>
    );
}