"use client";

import TrackBar from "@/components/TrackBar";
import React, { useEffect, useState } from "react";

const TrackPage: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="container mx-auto p-4 my-4 rounded-md">
      <div
        className={`transform transition-transform duration-500 ${
          fadeIn ? "translate-y-0 opacity-100" : "translate-y-[300px] opacity-0"
        }`}
      >
        <TrackBar />
      </div>
    </div>
  );
};

export default TrackPage;
