"use client";

import { useState, useEffect } from "react";

type TabId = "policies" | "fundraising" | "financials";

interface FinancialDocument {
  id: number;
  tabId: TabId;
  year: string;
  title: string;
  subtitle: string;
  filename: string;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "financials", label: "Our Past Financials", icon: "📊" },
  { id: "policies", label: "Policies", icon: "📋" },
  { id: "fundraising", label: "Fund Raising Documents", icon: "💰" },
];

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 text-[#2D7A4F]"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function OrgIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-[#2D7A4F] flex items-center justify-center shrink-0 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-[#E8F4ED] mb-4" />
      <div className="h-4 bg-[#E8F4ED] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[#F0F7F3] rounded w-3/4 mb-1" />
      <div className="h-3 bg-[#F0F7F3] rounded w-2/3 mb-5" />
      <div className="h-8 bg-[#E8F4ED] rounded-lg w-full" />
    </div>
  );
}

export default function Financialstab() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");
  const [allDocuments, setAllDocuments] = useState<FinancialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/financials")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAllDocuments(json.data as FinancialDocument[]);
        else setError(json.error || "Failed to load documents");
      })
      .catch(() => setError("Failed to load documents"))
      .finally(() => setLoading(false));
  }, []);

  const documents = allDocuments.filter((d) => d.tabId === activeTab);

  return (
    <section className="min-h-screen bg-[#F7F9F5]">
      {/* Mobile tab bar */}
      <div className="md:hidden bg-white border-b border-[#E5EDE8] sticky top-0 z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#2D7A4F] text-[#2D7A4F] bg-[#F0F7F3]"
                  : "border-transparent text-[#6B7B6E] hover:text-[#2D7A4F]"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-48px)] md:min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 lg:w-72 shrink-0 bg-white border-r border-[#E5EDE8]">
          <div className="px-4 pt-10 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9EB0A4] px-3 mb-3">
              Categories
            </p>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#EAF4EE] text-[#1A5C38] shadow-[inset_0_0_0_1px_#C5E0CF]"
                      : "text-[#5C7465] hover:bg-[#F3F8F5] hover:text-[#2D7A4F]"
                  }`}
                >
                  <span className="text-base leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {!loading && (
                    <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-[#2D7A4F] text-white"
                        : "bg-[#EAF4EE] text-[#2D7A4F]"
                    }`}>
                      {allDocuments.filter((d) => d.tabId === tab.id).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="mt-auto px-4 pb-8">
            <div className="bg-[#EAF4EE] rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#1A5C38] mb-1">Need a document?</p>
              <p className="text-xs text-[#5C7465] leading-relaxed">
                Contact us and we&apos;ll send you the required documents.
              </p>
              <a
                href="/contact-us"
                className="mt-3 inline-block text-xs font-semibold text-[#2D7A4F] hover:underline underline-offset-2"
              >
                Contact us →
              </a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <OrgIcon />
            <div>
              <h2 className="text-xl font-bold text-[#0F2419] leading-tight">
                AkhandJyoti Foundation
              </h2>
              <p className="text-xs text-[#8AA894] mt-0.5 font-medium tracking-wide">
                Section 8 Company · Non-Profit
              </p>
            </div>
          </div>

          {/* Active tab heading */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0F2419]">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              {!loading && (
                <p className="text-xs text-[#8AA894] mt-0.5">
                  {documents.length} document{documents.length !== 1 ? "s" : ""} available
                </p>
              )}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
            </div>
          )}

          {/* Document cards */}
          {!loading && documents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-white rounded-2xl p-5 border border-[#E5EDE8] hover:border-[#A8D4B8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] flex items-center justify-center shrink-0 group-hover:bg-[#D5EBE0] transition-colors duration-200">
                    <PdfIcon />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2D7A4F] leading-snug">
                      {doc.year}
                    </p>
                    <p className="text-sm font-semibold text-[#0F2419] mt-0.5 leading-snug">
                      {doc.title}
                    </p>
                    {doc.subtitle && (
                      <p className="text-xs text-[#8AA894] mt-1 leading-relaxed">
                        {doc.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#EEF4F0]" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/api/financials/pdf/${doc.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#6B7B6E] bg-[#F3F8F5] hover:bg-[#E5EDE8] rounded-lg transition-colors duration-150"
                    >
                      View
                    </a>
                    <a
                      href={`/api/financials/pdf/${doc.filename}`}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#2D7A4F] hover:bg-[#1A5C38] rounded-lg transition-colors duration-150 shadow-sm"
                    >
                      <DownloadIcon />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && documents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF4EE] flex items-center justify-center mb-4">
                <PdfIcon />
              </div>
              <p className="text-[#0F2419] font-semibold text-base mb-1">No documents yet</p>
              <p className="text-[#8AA894] text-sm">
                Documents will appear here once they&apos;re uploaded.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
