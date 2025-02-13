"use client";

import TrackBar from "@/components/TrackBar";
import React from "react";
import { useParams } from "next/navigation";
import ShipmentDetails from "@/components/ShipmentDetails";

const TrackPage: React.FC = () => {
  const params = useParams();
  const id = params ? params.id : null;
  return (
    <div className="container mx-auto p-4 my-4 rounded-md">
      <TrackBar />
      <div className="mx-auto p-4 my-4 bg-white rounded-md">
        <div className="mx-auto max-w-[780px] min-h-[30svh] justify-center items-center">
          {id && <ShipmentDetails waybillNumber={id as string} showCampaign={false} />}
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
