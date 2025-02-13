import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Shipment from "@/models/Shipment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        let shipment = null;
        if (id?.length === 12) {
          shipment = await Shipment.find({ waybillNumber: id });
        } else {
          shipment = await Shipment.find({ orderId: id });
        }
        if (!shipment) {
          return res.status(404).json({ error: "Shipment not found" });
        }
        res.status(200).json({ shipment });
      } catch (error) {
        res.status(400).json(error || { error: "Failed to update shipment" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
