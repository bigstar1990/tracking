"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";

import KeywordManager from "@/components/KeywordManager";
import StageManager from "@/components/StageManager";
import { UserDocument } from "@/models/User";
import { Session } from "next-auth";

interface CustomSession extends Session {
  user: UserDocument;
}

export default function Stream() {
  const { data: session, status } = useSession() as {
    data: CustomSession | null;
    status: string;
  };
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user.role !== "Admin") {
      router.push("/");
    }
  });

  return (
    <div className="p-6 min-h-[80svh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Stream Page</h1>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Available Keywords</h2>
          <KeywordManager />
        </div>

        {/* Stages */}
        <div className="col-span-12 lg:col-span-9 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Stages</h2>
          <StageManager />
        </div>
      </div>
    </div>
  );
}
