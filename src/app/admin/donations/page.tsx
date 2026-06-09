"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Donation {
    transaction_id: number;
    txn_id: string;
    donor_name: string;
    donor_email: string;
    donor_phone: string;
    donor_pan: string;
    amount: number;
    payment_status: string;
    payu_payment_id: string;
    bank_ref_num: string;
    gateway_response_message: string;
    created_at: string;
    updated_at: string;
}
interface Summary { total_txns: number; successful: number; failed: number; total_amount: number; }
interface Pagination { page: number; pageSize: number; total: number; totalPages: number; }
interface Filters { status: string; search: string; dateFrom: string; dateTo: string; amountMin: string; amountMax: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fINR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
const fDate = (s: string) => {
    const d = new Date(s);

    return d.toLocaleString("en-IN", {
        timeZone: "UTC",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const STATUS_STYLE: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    INITIATED: "bg-blue-100 text-blue-800 border-blue-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
    HASH_MISMATCH: "bg-orange-100 text-orange-800 border-orange-200",
    VERIFICATION_FAILED: "bg-purple-100 text-purple-800 border-purple-200",
};
const STATUS_OPTIONS = ["ALL", "SUCCESS", "FAILED", "INITIATED", "PENDING", "CANCELLED", "HASH_MISMATCH",
    "BOUNCED", "DROPPED"
];
const PAGE_SIZES = [10, 20, 50, 100];

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
                        animate-[slideIn_0.2s_ease-out]
                        ${t.type === "success" ? "bg-[#2D7A4F] text-white"
                            : t.type === "error" ? "bg-red-600 text-white"
                                : "bg-gray-800 text-white"}`}
                >
                    {t.type === "success" && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {t.type === "error" && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {t.type === "info" && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span>{t.message}</span>
                    <button onClick={() => onRemove(t.id)} className="ml-1 opacity-70 hover:opacity-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [certLoading, setCertLoading] = useState<string | null>(null);

    // Per-row action loading states
    const [emailLoading, setEmailLoading] = useState<string | null>(null);
    const [reverifyLoading, setReverifyLoading] = useState<string | null>(null);

    // PAN update modal
    const [panModal, setPanModal] = useState<{ txnId: string; txn_id: string; currentPan: string; donorName: string } | null>(null);
    const [panInput, setPanInput] = useState("");
    const [panLoading, setPanLoading] = useState(false);
    const [panError, setPanError] = useState<string | null>(null);

    // Toast notifications
    const [toasts, setToasts] = useState<Toast[]>([]);
    const toastId = useRef(0);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = ++toastId.current;
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(t => t.filter(x => x.id !== id));
    }, []);

    const formatIndianDate = (date: Date) =>
        date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const [filters, setFilters] = useState<Filters>({
        status: "ALL",
        search: "",
        dateFrom: formatIndianDate(sevenDaysAgo),
        dateTo: formatIndianDate(today),
        amountMin: "",
        amountMax: ""
    });
    const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Fetch ──────────────────────────────────────────────────────────
    const fetchDonations = useCallback(async (f: Filters, page: number, pageSize: number) => {
        setLoading(true);
        try {
            const p = new URLSearchParams({
                ...(f.status !== "ALL" && { status: f.status }),
                ...(f.search && { search: f.search }),
                ...(f.dateFrom && { dateFrom: f.dateFrom }),
                ...(f.dateTo && { dateTo: f.dateTo }),
                ...(f.amountMin && { amountMin: f.amountMin }),
                ...(f.amountMax && { amountMax: f.amountMax }),
                page: page.toString(), pageSize: pageSize.toString(),
            });
            const res = await fetch(`/api/admin/donations?${p}`);
            const data = await res.json();
            if (data.success) {
                setDonations(data.donations);
                setSummary(data.summary);
                setPagination(data.pagination);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDonations(appliedFilters, 1, pagination.pageSize); }, []);

    // ── Apply / clear ──────────────────────────────────────────────────
    const apply = (f: Filters, ps = pagination.pageSize) => {
        setAppliedFilters(f);
        fetchDonations(f, 1, ps);
    };
    const handleApply = () => apply(filters);
    const handleClear = () => {
        const empty: Filters = { status: "ALL", search: "", dateFrom: "", dateTo: "", amountMin: "", amountMax: "" };
        setFilters(empty);
        apply(empty);
    };
    const handleSearchChange = (val: string) => {
        setFilters(f => ({ ...f, search: val }));
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            const updated = { ...filters, search: val };
            setAppliedFilters(updated);
            fetchDonations(updated, 1, pagination.pageSize);
        }, 500);
    };
    const handlePageSize = (ps: number) => {
        setPagination(p => ({ ...p, pageSize: ps }));
        fetchDonations(appliedFilters, 1, ps);
    };
    const handlePage = (p: number) => fetchDonations(appliedFilters, p, pagination.pageSize);

    // ── Excel export ───────────────────────────────────────────────────
    const handleExport = async () => {
        setExporting(true);
        try {
            const p = new URLSearchParams({
                ...(appliedFilters.status !== "ALL" && { status: appliedFilters.status }),
                ...(appliedFilters.search && { search: appliedFilters.search }),
                ...(appliedFilters.dateFrom && { dateFrom: appliedFilters.dateFrom }),
                ...(appliedFilters.dateTo && { dateTo: appliedFilters.dateTo }),
                ...(appliedFilters.amountMin && { amountMin: appliedFilters.amountMin }),
                ...(appliedFilters.amountMax && { amountMax: appliedFilters.amountMax }),
            });
            const res = await fetch(`/api/admin/export?${p}`);
            if (!res.ok) { addToast("Export failed. Please try again.", "error"); return; }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `AJF-Donations-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setExporting(false);
        }
    };

    // ── 80G Certificate ────────────────────────────────────────────────
    const handleCert = async (txnid_enc: string) => {
        try {
            setCertLoading(txnid_enc);
            const res = await fetch(`/api/admin/encryptTxnid/`, { method: "POST", body: JSON.stringify({ txn_id: txnid_enc }), headers: { "Content-Type": "application/json" } });
            const enc_txn_id = await res.json();
            window.open(`/receipt/${enc_txn_id}`, "_blank");
        } catch (err) {
            console.error(err);
            addToast("Unable to open certificate.", "error");
        }
        setCertLoading(null);
    };

    // ── Send Email ─────────────────────────────────────────────────────
    const handleSendEmail = async (d: Donation) => {
        if (!d.donor_email) {
            addToast("No email address found for this donor.", "error");
            return;
        }
        setEmailLoading(d.txn_id);
        try {
            const res = await fetch("/api/send-donation-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toEmail: d.donor_email,
                    toName: d.donor_name,
                    txnid: d.txn_id,
                    amount: d.amount.toString(),
                    mihpayid: d.payu_payment_id || d.txn_id,
                    certificate: true
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? "Failed to send email");
            }
            addToast(`Email sent to ${d.donor_email}`, "success");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            addToast(`Email failed: ${msg}`, "error");
        } finally {
            setEmailLoading(null);
        }
    };

    // ── Reverify Payment ───────────────────────────────────────────────
    const handleReverify = async (d: Donation) => {
        setReverifyLoading(d.txn_id);
        try {
            const res = await fetch("/api/admin/reverify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txnid: d.txn_id }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? "Reverification failed");
            }
            const data = await res.json();
            addToast(
                data.newStatus === "SUCCESS"
                    ? `✓ Payment verified as SUCCESS for ${d.txn_id}`
                    : `Status updated to ${data.newStatus} for ${d.txn_id}`,
                data.newStatus === "SUCCESS" ? "success" : "info"
            );
            // Refresh current page to show updated status
            fetchDonations(appliedFilters, pagination.page, pagination.pageSize);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            addToast(`Reverify failed: ${msg}`, "error");
        } finally {
            setReverifyLoading(null);
        }
    };

    // ── Update PAN ─────────────────────────────────────────────────────
    const openPanModal = (d: Donation) => {
        setPanInput(d.donor_pan || "");
        setPanError(null);
        setPanModal({ txnId: String(d.transaction_id), txn_id: d.txn_id, currentPan: d.donor_pan || "", donorName: d.donor_name });
    };

    const handleUpdatePan = async () => {
        if (!panModal) return;
        const pan = panInput.trim().toUpperCase();

        // Validate PAN format: 5 letters, 4 digits, 1 letter
        if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            setPanError("Invalid PAN format. Expected: ABCDE1234F");
            return;
        }

        setPanLoading(true);
        setPanError(null);
        try {
            const res = await fetch("/api/admin/update-pan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txnid: panModal.txn_id, pan }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? "Failed to update PAN");
            }
            addToast(`PAN updated for ${panModal.donorName}`, "success");
            setPanModal(null);
            fetchDonations(appliedFilters, pagination.page, pagination.pageSize);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setPanError(msg);
        } finally {
            setPanLoading(false);
        }
    };

    // ── Pagination range ───────────────────────────────────────────────
    const pageRange = () => {
        const { page, totalPages } = pagination;
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
        if (page >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "…", page - 1, page, page + 1, "…", totalPages];
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F0F7EB] font-sans">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-5 py-5 space-y-4">

                {/* ── Summary cards ── */}
                {summary && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: "Total Donations", value: summary.total_txns?.toLocaleString(), from: "from-[#2D7A4F]", to: "to-[#4a8a2e]" },
                            { label: "Successful", value: summary.successful?.toLocaleString(), from: "from-[#16a34a]", to: "to-[#15803d]" },
                            { label: "Failed", value: summary.failed?.toLocaleString(), from: "from-[#dc2626]", to: "to-[#b91c1c]" },
                            { label: "Total Collected", value: fINR(summary.total_amount || 0), from: "from-[#81BA45]", to: "to-[#5a9e2f]" },
                        ].map(c => (
                            <div key={c.label} className={`bg-gradient-to-br ${c.from} ${c.to} rounded-2xl p-4 shadow-md`}>
                                <p className="text-xl font-bold text-white">{c.value}</p>
                                <p className="text-xs text-white/75 mt-0.5">{c.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#d6e8c8] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-[#2D7A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        <span className="text-sm font-semibold text-[#1a3a10]">Filters</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        <div className="lg:col-span-2">
                            <label className="text-[11px] text-gray-400 mb-1 block font-medium">Search</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Name, email, phone, TXN ID…"
                                    value={filters.search}
                                    onChange={e => handleSearchChange(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-[#81BA45] focus:ring-2 focus:ring-[#81BA45]/20 text-gray-800"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] text-gray-400 mb-1 block font-medium">Status</label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#81BA45] bg-white text-gray-800"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] text-gray-400 mb-1 block font-medium">From Date</label>
                            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#81BA45] text-gray-800" />
                        </div>
                        <div>
                            <label className="text-[11px] text-gray-400 mb-1 block font-medium">To Date</label>
                            <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#81BA45] text-gray-800" />
                        </div>
                        <div>
                            <label className="text-[11px] text-gray-400 mb-1 block font-medium">Amount (₹)</label>
                            <div className="flex gap-1">
                                <input type="number" placeholder="Min" value={filters.amountMin}
                                    onChange={e => setFilters(f => ({ ...f, amountMin: e.target.value }))}
                                    className="w-1/2 border border-gray-200 rounded-xl px-2 py-2.5 text-sm outline-none focus:border-[#81BA45] text-gray-800" />
                                <input type="number" placeholder="Max" value={filters.amountMax}
                                    onChange={e => setFilters(f => ({ ...f, amountMax: e.target.value }))}
                                    className="w-1/2 border border-gray-200 rounded-xl px-2 py-2.5 text-sm outline-none focus:border-[#81BA45] text-gray-800" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button onClick={handleApply}
                            className="bg-[#2D7A4F] hover:bg-[#1e5c38] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                            Apply Filters
                        </button>
                        <button onClick={handleClear}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                            Clear
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={exporting || pagination.total === 0}
                            className="flex items-center gap-2 bg-[#217346] hover:bg-[#1a5c38] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                            {exporting ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            {exporting ? "Exporting…" : `Export Excel${pagination.total > 0 ? ` (${pagination.total?.toLocaleString()})` : ""}`}
                        </button>
                        {pagination.total > 0 && (
                            <span className="ml-auto text-xs text-gray-400">
                                <span className="font-semibold text-[#2D7A4F]">{pagination.total?.toLocaleString()}</span> record{pagination.total !== 1 ? "s" : ""} match
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Table card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#d6e8c8] overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-xs text-gray-500">
                            {loading ? "Loading…" : (
                                pagination.total > 0
                                    ? `Showing ${((pagination.page - 1) * pagination.pageSize) + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total?.toLocaleString()}`
                                    : "No records"
                            )}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Rows per page:</span>
                            <select
                                value={pagination.pageSize}
                                onChange={e => handlePageSize(Number(e.target.value))}
                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 outline-none focus:border-[#81BA45] bg-white"
                            >
                                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div style={{ minHeight: 400 }}>
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-[#2D7A4F]">
                                        {["#", "Transaction ID", "Donor", "Phone", "PAN", "Amount", "Status", "PayU Ref", "Date", "Actions"].map(h => (
                                            <th key={h} className="px-3.5 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: pagination.pageSize }).map((_, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFFF7]"}>
                                                {Array.from({ length: 9 }).map((_, j) => (
                                                    <td key={j} className="px-3.5 py-3">
                                                        <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: j === 1 ? 110 : j === 2 ? 130 : j === 4 ? 70 : 80 }} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : donations.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-20 text-center">
                                                <div className="text-3xl mb-2">🔍</div>
                                                <p className="font-medium text-gray-500">No donations found</p>
                                                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        donations.map((d, i) => (
                                            <tr key={d.transaction_id}
                                                className={`border-b border-gray-50 hover:bg-[#F5FCF0] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFFF7]"}`}>

                                                {/* # */}
                                                <td className="px-3.5 py-3 text-gray-300 text-xs tabular-nums">
                                                    {(pagination.page - 1) * pagination.pageSize + i + 1}
                                                </td>

                                                {/* TXN ID */}
                                                <td className="px-3.5 py-3">
                                                    <span className="font-mono text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{d.txn_id}</span>
                                                </td>

                                                {/* Donor */}
                                                <td className="px-3.5 py-3 max-w-[180px]">
                                                    <p className="font-medium text-gray-800 truncate text-sm">{d.donor_name}</p>
                                                    <p className="text-[11px] text-gray-400 truncate">{d.donor_email || "—"}</p>
                                                </td>

                                                {/* Phone */}
                                                <td className="px-3.5 py-3 text-xs text-gray-500 whitespace-nowrap">{d.donor_phone || "—"}</td>

                                                {/* Pan */}
                                                <td className="px-3.5 py-3 text-xs text-gray-500 whitespace-nowrap">{d.donor_pan || "—"}</td>

                                                {/* Amount */}
                                                <td className="px-3.5 py-3">
                                                    <span className="font-bold text-[#1a3a10] whitespace-nowrap">{fINR(d.amount)}</span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-3.5 py-3">
                                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLE[d.payment_status] || "bg-gray-100 text-gray-600"}`}>
                                                        {d.payment_status}
                                                    </span>
                                                </td>

                                                {/* PayU ref */}
                                                <td className="px-3.5 py-3 text-[11px] text-gray-400 font-mono">
                                                    {d.payu_payment_id ? d.payu_payment_id.slice(0, 12) + "…" : "—"}
                                                </td>

                                                {/* Date */}
                                                <td className="px-3.5 py-3 text-[11px] text-gray-500 whitespace-nowrap">{fDate(d.created_at)}</td>

                                                {/* ── Actions ── */}
                                                <td className="px-3.5 py-3">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {d.payment_status === "SUCCESS" ? (
                                                            <>
                                                                {/* 80G PDF */}
                                                                <button
                                                                    onClick={() => handleCert(d.txn_id)}
                                                                    disabled={certLoading === d.txn_id}
                                                                    title="Download 80G Certificate"
                                                                    className="flex items-center gap-1 bg-[#E8F5ED] hover:bg-[#d1edd9] text-[#2D7A4F] text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
                                                                >
                                                                    {certLoading === d.txn_id ? (
                                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                    )}
                                                                    80G
                                                                </button>

                                                                {/* Send Email */}
                                                                <button
                                                                    onClick={() => handleSendEmail(d)}
                                                                    disabled={emailLoading === d.txn_id || !d.donor_email}
                                                                    title={d.donor_email ? `Send confirmation to ${d.donor_email}` : "No email on record"}
                                                                    className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                                >
                                                                    {emailLoading === d.txn_id ? (
                                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                        </svg>
                                                                    )}
                                                                    Email
                                                                </button>
                                                            </>
                                                        ) : (
                                                            /* Reverify — shown for all non-SUCCESS statuses */
                                                            <button
                                                                onClick={() => handleReverify(d)}
                                                                disabled={reverifyLoading === d.txn_id}
                                                                title={`Re-check payment status with PayU for ${d.txn_id}`}
                                                                className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
                                                            >
                                                                {reverifyLoading === d.txn_id ? (
                                                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                    </svg>
                                                                )}
                                                                Reverify
                                                            </button>
                                                        )}

                                                        {/* PAN Update — shown for ALL rows */}
                                                        <button
                                                            onClick={() => openPanModal(d)}
                                                            title={d.donor_pan ? `Update PAN (current: ${d.donor_pan})` : "Add PAN number"}
                                                            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                            </svg>
                                                            {d.donor_pan ? "PAN" : "+ PAN"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Pagination ── */}
                    {!loading && pagination.totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                            <p className="text-xs text-gray-400">
                                Page <span className="font-semibold text-gray-700">{pagination.page}</span> of <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handlePage(1)} disabled={pagination.page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 text-xs">«</button>
                                <button onClick={() => handlePage(pagination.page - 1)} disabled={pagination.page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500">‹</button>
                                {pageRange().map((p, i) =>
                                    p === "…" ? (
                                        <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-gray-400 text-xs">…</span>
                                    ) : (
                                        <button key={p} onClick={() => handlePage(p as number)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                                                ${p === pagination.page ? "bg-[#2D7A4F] text-white shadow-sm" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}>
                                            {p}
                                        </button>
                                    )
                                )}
                                <button onClick={() => handlePage(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500">›</button>
                                <button onClick={() => handlePage(pagination.totalPages)} disabled={pagination.page === pagination.totalPages}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 text-xs">»</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ── PAN Update Modal ── */}
            {panModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !panLoading && setPanModal(null)}
                    />
                    {/* Dialog */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Update PAN Number</h3>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">{panModal.donorName} · {panModal.txn_id}</p>
                            </div>
                            <button
                                onClick={() => !panLoading && setPanModal(null)}
                                className="ml-auto text-gray-300 hover:text-gray-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Current PAN badge */}
                        {panModal.currentPan && (
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-xs text-gray-400">Current PAN:</span>
                                <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
                                    {panModal.currentPan}
                                </span>
                            </div>
                        )}

                        {/* Input */}
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                                New PAN Number
                            </label>
                            <input
                                type="text"
                                value={panInput}
                                onChange={e => { setPanInput(e.target.value.toUpperCase()); setPanError(null); }}
                                placeholder="e.g. ABCDE1234F"
                                maxLength={10}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono
                                           outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                                           text-gray-800 tracking-widest uppercase placeholder:tracking-normal placeholder:font-sans"
                            />
                            {/* Format hint */}
                            <p className="text-[11px] text-gray-400 mt-1.5">
                                Format: 5 letters · 4 digits · 1 letter &nbsp;(e.g. ABCDE1234F)
                            </p>
                            {/* Error */}
                            {panError && (
                                <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {panError}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setPanModal(null)}
                                disabled={panLoading}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePan}
                                disabled={panLoading || !panInput.trim()}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white
                                           bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {panLoading ? (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {panLoading ? "Saving…" : "Save PAN"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tailwind keyframe for toast slide-in */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </div>
    );
}