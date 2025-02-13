import { useState, useEffect } from "react";
import { getStages } from "@/actions/stage";
import { IStageProps } from "@/models/Stage";
import { IShipmentProps } from "@/models/Shipment";
import { addDeadline } from "@/lib/time";
import { shortCodeParsed } from "@/utils/text";

interface IStageTimelineProps {
  shipment: IShipmentProps | null;
}

export default function StageTimeline({ shipment }: IStageTimelineProps) {
  const [stages, setStages] = useState<IStageProps[]>([]);

  useEffect(() => {
    const fetchStages = async () => {
      const result = await getStages();
      if (!result.error && result.stages) {
        setStages(JSON.parse(result.stages));
      }
    };
    fetchStages();
  }, []);

  return (
    <div className="min-h-[50svh]">
      {shipment && (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {stages
            .filter(
              (stage) => addDeadline(shipment.orderUpdatedAt, stage) <= new Date()
            )
            .map((stage, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="10"
                  >
                    <path
                      fillRule="nonzero"
                      d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                    />
                  </svg>
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900">{stage.name}</div>
                    <time className="font-caveat font-medium text-indigo-500">
                      {addDeadline(shipment.orderUpdatedAt, stage).toLocaleString(
                        "en-US",
                        {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </time>
                  </div>
                  <div className="text-slate-500">
                    {shortCodeParsed(shipment, stage.text)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
