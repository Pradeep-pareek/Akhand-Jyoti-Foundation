"use client";

import { useState } from "react";

type TabId = "policies" | "fundraising" | "financials";

interface Document {
  id: number;
  year: string;
  title: string;
  subtitle: string;
}

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: "policies", label: "Policies" },
  { id: "fundraising", label: "Fund Raising Documents" },
  { id: "financials", label: "Our Past Financials" },
];

const mockDocuments: Record<TabId, Document[]> = {
  policies: [
    { id: 1, year: "Policy 2023", title: "Annual Financial Statement", subtitle: "Board Approved Document" },
    { id: 2, year: "Policy 2022", title: "Annual Financial Statement", subtitle: "Human Resources Manual" },
    { id: 3, year: "Policy 2021", title: "Annual Financial Statement", subtitle: "Ethics & Compliance" },
    { id: 4, year: "Policy 2020", title: "Annual Financial Statement", subtitle: "Data Protection Guidelines" },
  ],
  fundraising: [
    { id: 1, year: "FY 2023–24", title: "Fundraising Proposal", subtitle: "Annual Campaign Document" },
    { id: 2, year: "FY 2022–23", title: "Impact Report", subtitle: "Donor Communication" },
    { id: 3, year: "FY 2021–22", title: "Grant Application", subtitle: "Funding Request Document" },
    { id: 4, year: "FY 2020–21", title: "CSR Proposal", subtitle: "Corporate Partnership Deck" },
    { id: 5, year: "FY 2019–20", title: "Crowdfunding Report", subtitle: "Online Campaign Summary" },
  ],
  financials: [
    { id: 1, year: "FY 2023–24", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 2, year: "FY 2022–23", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 3, year: "FY 2021–22", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 4, year: "FY 2020–21", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 5, year: "FY 2019–20", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 6, year: "FY 2018–19", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
    { id: 7, year: "FY 2017–18", title: "Annual Financial Statement", subtitle: "Audited Accounts" },
  ],
};

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-[#5a7a5a]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function OrgIcon() {
  return (
    <div className="w-14 h-14 rounded-lg bg-[#5a7a5a] flex items-center justify-center flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-[#fff]"
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

export default function Financialstab() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");

  const documents = mockDocuments[activeTab];

  return (
    <section className="min-h-screen bg-[#f5f0eb] font-serif">
      <div className="md:hidden overflow-x-auto border-b border-[#d9cfc5] bg-white">
        <div className="flex whitespace-nowrap px-4 py-1 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px  ${
                activeTab === tab.id
                  ? "border-[#5a7a5a] text-[#3d5c3d] font-semibold"
                  : "border-transparent text-[#7a7068] hover:text-[#3d5c3d]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex min-h-[calc(100vh-48px)] md:min-h-screen">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 flex-shrink-0 bg-white border-r border-[#e0d8cf]">
          <div className="pt-10 pb-6 px-2">
            <nav className="space-y-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left cursor-pointer px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[#E6EBDB] text-[#3d5c3d] font-normal"
                      : "text-[#7a7068] hover:bg-[#f5f1ec] hover:text-[#3d5c3d] font-normal"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <OrgIcon />
            <div>
              <h2 className="lg:text-2xl md:text-xl text-lg font-semibold text-[#000] leading-tight tracking-tight">
                Akhandjyoti Foundation
              </h2>
              <p className="text-xs text-[#8a8078] mt-0.5 tracking-wide">
                Section 8 Company · Non-Profit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group bg-[#FFFFFF] rounded-[16px] p-5 shadow-sm border border-[#D3D1C7] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
              >
                <div className="w-13 h-13 rounded-[12px] bg-[#EAF1ED] flex items-center justify-center">
                  <DocumentIcon />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#2D7A4F] leading-snug">
                    {doc.year}
                  </p>
                  <p className="text-base text-[#000] font-medium mt-0.5 leading-snug">
                    {doc.title}
                  </p>
                </div>

                <button className="flex items-center gap-1.5 text-base font-medium text-[#000] hover:text-[#3d5c3d] transition-colors duration-150 group/btn cursor-pointer">
                  <DownloadIcon />
                  <span className="group-hover/btn:underline underline-offset-2">
                    Download PDF
                  </span>
                </button>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#eef2eb] flex items-center justify-center mb-4">
                <DocumentIcon />
              </div>
              <p className="text-[#7a7068] text-sm">No documents available yet.</p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}