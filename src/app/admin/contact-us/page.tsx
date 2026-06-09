"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ContactItem {
    ContactID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Message: string;
    IsRead: boolean;
    CreatedDate: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function ContactUsAdminPage() {
    const [data, setData] = useState<ContactItem[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [loader, setLoader] = useState(false);
    const [excelLoader, setExcelLoader] = useState(false);

    const fetchData = (page = 1, limit = pagination.limit) => {
        setLoader(true);
        fetch(`/api/admin/contact-us?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setData(res.data);
                    setPagination(res.pagination);
                }
            })
            .finally(() => setLoader(false));
    };

    const downloadExcel = async () => {
        setExcelLoader(true);
        try {
            const res = await fetch("/api/admin/contact-us?export=true");
            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `contact-requests-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to download Excel. Please try again.");
        } finally {
            setExcelLoader(false);
        }
    };
    useEffect(() => {
        fetchData(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        fetchData(newPage);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        fetchData(1, Number(e.target.value));
    };

    const startEntry = (pagination.page - 1) * pagination.limit + 1;
    const endEntry = Math.min(pagination.page * pagination.limit, pagination.total);

    return (
        <div className="p-6 mt-2 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contact Requests</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {pagination.total} total {pagination.total === 1 ? "entry" : "entries"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={downloadExcel}
                        disabled={excelLoader || loader}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {excelLoader ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Excel
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => fetchData(pagination.page)}
                        disabled={loader}
                        className="flex items-center gap-2 px-4 py-2 bg-[#81BA45] hover:bg-[#6fa036] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {loader ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col" style={{ height: "calc(100vh - 200px)" }}>

                {/* Scrollable table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-[#a8d578] text-gray-800">
                                <th className="px-4 py-3 text-left font-semibold">#</th>
                                <th className="px-4 py-3 text-left font-semibold">Name</th>
                                <th className="px-4 py-3 text-left font-semibold">Email</th>
                                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                                <th className="px-4 py-3 text-left font-semibold">Message</th>
                                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loader ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 bg-gray-200 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                        No contact requests found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.ContactID}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                            {startEntry + index}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                                            {item.FirstName} {item.LastName}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <a href={`mailto:${item.Email}`} className="hover:text-[#81BA45] hover:underline">
                                                {item.Email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                            {item.Phone}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={item.Message}>
                                            {item.Message}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                                            {new Date(item.CreatedDate).toISOString().slice(0, 19).replace("T", " ")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!loader && data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">

                        {/* Entries info + per-page selector */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>
                                Showing <span className="font-medium text-gray-700">{startEntry}–{endEntry}</span> of{" "}
                                <span className="font-medium text-gray-700">{pagination.total}</span>
                            </span>
                            <select
                                value={pagination.limit}
                                onChange={handleLimitChange}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#81BA45]"
                            >
                                {[10, 20, 50, 100].map(n => (
                                    <option key={n} value={n}>{n} / page</option>
                                ))}
                            </select>
                        </div>

                        {/* Page buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1}
                                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="First page"
                            >«</button>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Previous page"
                            >‹</button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(p =>
                                    p === 1 ||
                                    p === pagination.totalPages ||
                                    Math.abs(p - pagination.page) <= 1
                                )
                                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p as number)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${pagination.page === p
                                                ? "bg-[#81BA45] text-white"
                                                : "text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )
                            }

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Next page"
                            >›</button>
                            <button
                                onClick={() => handlePageChange(pagination.totalPages)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Last page"
                            >»</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}