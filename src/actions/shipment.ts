import { IShipmentProps } from "@/models/Shipment";
import axios from "axios";
import { ObjectId } from "mongoose";

export const getShipments = async (
  page = 1,
  limit = 10,
  search = "",
  email = "",
  name = "",
  orderId = "",
  campaignId = "",
  campaignName = ""
) => {
  try {
    const response = await axios.get("/api/shipments", {
      params: {
        page,
        limit,
        search,
        email,
        name,
        orderId,
        campaignId,
        campaignName,
      },
    });
    return response.data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const registerShipment = async (shipment: IShipmentProps) => {
  try {
    const response = await axios.post("/api/shipments", shipment);
    return response.data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const modifyShipment = async (
  id: ObjectId,
  shipment: IShipmentProps
) => {
  try {
    const response = await axios.put(`/api/shipments/${id}`, shipment);
    return response.data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const removeShipment = async (id: ObjectId) => {
  try {
    const response = await axios.delete(`/api/shipments/${id}`);
    return response.data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
