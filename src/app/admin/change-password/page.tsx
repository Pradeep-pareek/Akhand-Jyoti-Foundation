"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setMessage({ text: "All fields are required.", ok: false });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "New passwords do not match.", ok: false });
      return;
    }
    if (form.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", ok: false });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      setMessage({ text: data.message, ok: res.ok });
      if (res.ok) {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  );

  const fields = [
    {
      key: "current" as const,
      field: "currentPassword" as const,
      label: "Current Password",
      placeholder: "Enter your current password",
    },
    {
      key: "new" as const,
      field: "newPassword" as const,
      label: "New Password",
      placeholder: "Enter a new password",
    },
    {
      key: "confirm" as const,
      field: "confirmPassword" as const,
      label: "Confirm New Password",
      placeholder: "Re-enter your new password",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-[#d4e8c4] overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6ab04c] to-[#81BA45]" />

          <div className="px-8 py-8">

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#e8f5e2] rounded-xl mb-4">
                <svg className="w-6 h-6 text-[#6ab04c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
              <p className="text-sm text-gray-500 mt-1">Update your admin account password</p>
            </div>

            {/* Fields */}
            <div className="space-y-5">
              {fields.map(({ key, field, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords[key] ? "text" : "password"}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full pl-4 pr-10 py-2.5 bg-[#f4f7f0] border border-[#d4e8c4] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ab04c] focus:border-transparent focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((p) => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon show={showPasswords[key]} />
                    </button>
                  </div>
                  {/* Inline mismatch hint */}
                  {key === "confirm" && form.confirmPassword && form.newPassword !== form.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span>✕</span> Passwords do not match
                    </p>
                  )}
                  {key === "confirm" && form.confirmPassword && form.newPassword === form.confirmPassword && (
                    <p className="text-xs text-[#6ab04c] mt-1.5 flex items-center gap-1">
                      <span>✓</span> Passwords match
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#e8f5e2]" />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-[#6ab04c] hover:bg-[#4e8a34] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Updating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Password
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`mt-4 flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm font-medium border ${
                message.ok
                  ? "bg-[#e8f5e2] border-[#b8e0a2] text-[#3a6e25]"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <span className="mt-0.5 shrink-0">{message.ok ? "✓" : "⚠"}</span>
                <span>{message.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Password must be at least 6 characters long.
        </p>
      </div>
    </div>
  );
}