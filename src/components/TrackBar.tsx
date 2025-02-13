"use client";

import React, { useState } from "react";
import { BarcodeOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";

const TrackBar: React.FC = () => {
  const [waybillNumber, setWaybillNumber] = useState("");
  const router = useRouter();

  const handleExploreClick = async () => {
    router.push(`/track/${waybillNumber}`);
  };

  return (
    <div>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="grid grid-cols-1 gap-4 flex-1">
            <div className="relative">
              <BarcodeOutlined
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all hover:bg-white/20"
                placeholder="Input your waybill number or order ID, here."
                value={waybillNumber}
                onChange={(e) => setWaybillNumber(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 font-medium self-end"
            onClick={handleExploreClick} // Add onClick handler
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackBar;
