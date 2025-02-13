import React, { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import { IShipmentProps } from "@/models/Shipment";
import StageTimeline from "./StageTimeline";

interface ShipmentDetailsProps {
  waybillNumber: string;
  showCampaign?: boolean;
  handleCloseModal?: () => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({
  waybillNumber,
  showCampaign = true,
  handleCloseModal,
}) => {
  const [shipment, setShipment] = useState<IShipmentProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shipments/waybill/${waybillNumber}`);
        const data = await response.json();
        if (!data?.shipment.length) {
          setError("Input the correct number!");
          setShipment(null);
          if (handleCloseModal) handleCloseModal();
          return;
        }
        setError(null);
        setShipment(data.shipment[0]);
      } catch {
        setError("Failed to load shipment details");
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [waybillNumber, handleCloseModal]);

  return (
    <div className="min-h-[40svh] justify-center items-center">
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-8">
            <p>Waybill Number: {shipment?.waybillNumber}</p>
            <p>Address: {shipment?.address}</p>
            <p>Delivery Contact: {shipment?.deliveryContact}</p>
            <p>Order ID: {shipment?.orderId}</p>
            <p>
              Customer: {shipment?.customer && shipment?.customer.firstname}{" "}
              {shipment?.customer && shipment?.customer.lastname}
            </p>
            <p>Email: {shipment?.customer && shipment?.customer.email}</p>
            {showCampaign && (
              <>
                <p>
                  Campaign Id: {shipment?.order && shipment?.order?.campaignId}
                </p>
                <p>
                  Campaign Name:{" "}
                  {shipment?.order && shipment?.order?.campaignName}
                </p>
              </>
            )}
          </div>
          <StageTimeline shipment={shipment} />
        </div>
      )}
    </div>
  );
};

export default ShipmentDetails;
