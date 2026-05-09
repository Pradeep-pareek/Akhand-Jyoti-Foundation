"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-xl">
      Redirecting...
    </div>
  );
}