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
        const shipment = await Shipment.findById(id);
        if (!shipment) {
          return res.status(404).json({ error: "Shipment not found" });
        }
        res.status(200).json({ shipment });
      } catch (error) {
        res.status(400).json(error || { error: "Failed to update shipment" });
      }
      break;

    case "PUT":
      try {
        const shipment = await Shipment.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!shipment) {
          return res.status(404).json({ error: "Shipment not found" });
        }
        res.status(200).json({ success: "Shipment updated successfully" });
      } catch (error) {
        res.status(400).json(error || { error: "Failed to update shipment" });
      }
      break;

    case "DELETE":
      try {
        const shipment = await Shipment.findByIdAndDelete(id);
        if (!shipment) {
          return res.status(404).json({ error: "Shipment not found" });
        }
        res.status(200).json({ success: "Shipment deleted successfully" });
      } catch (error) {
        res.status(400).json(error || { error: "Failed to delete shipment" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
