import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Shipment from "@/models/Shipment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { method } = req;
  const {
    page = 1,
    limit = 10,
    search = "",
    email = "",
    name = "",
    orderId = "",
    campaignId = -1,
    campaignName = "",
  } = req.query;

  const parsedCampaignId = Number(campaignId) || -1;

  switch (method) {
    case "GET":
      try {
        const query: Record<string, object | number> = {
          waybillNumber: { $regex: search, $options: "i" },
          "customer.email": { $regex: email, $options: "i" },
          $or: [
            { "customer.firstname": { $regex: name, $options: "i" } },
            { "customer.lastname": { $regex: name, $options: "i" } },
          ],
          orderId: { $regex: orderId, $options: "i" },
          "order.campaignName": { $regex: campaignName, $options: "i" },
        };

        if (parsedCampaignId !== -1) {
          query["order.campaignId"] = parsedCampaignId;
        }

        const shipments = await Shipment.find(query)
          .sort({ orderCreatedAt: -1 }) // Added sorting by orderCreatedAt in descending order
          .skip((+page - 1) * +limit)
          .limit(+limit);

        const total = await Shipment.countDocuments(query);

        res.status(200).json({ shipments, total, page: +page, limit: +limit });
      } catch (error) {
        res.status(500).json({
          error: (error as Error).message || "Failed to fetch shipments",
        });
      }
      break;

    case "POST":
      try {
        const shipment = new Shipment(req.body);
        await shipment.save();
        res.status(201).json({ success: "Shipment created successfully" });
      } catch (error) {
        res.status(400).json({
          error: (error as Error).message || "Failed to create shipment",
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
