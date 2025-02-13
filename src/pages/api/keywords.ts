import { NextApiRequest, NextApiResponse } from "next";
import { getKeywords, addKeyword, removeKeyword } from "@/lib/keyword";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const keywords = await getKeywords();
        res.status(200).json({ keywords });
      } catch (error) {
        res.status(500).json({
          error: (error as Error).message || "Failed to fetch keywords",
        });
      }
      break;
    case "POST":
      try {
        const { keyword } = req.body;
        const newKeyword = await addKeyword(keyword);
        res.status(201).json({ keyword: newKeyword });
      } catch (error) {
        res.status(500).json({
          error: (error as Error).message || "Failed to fetch keywords",
        });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const deletedKeyword = await removeKeyword(id);
        res.status(200).json({ keyword: deletedKeyword });
      } catch (error) {
        res.status(500).json({
          error: (error as Error).message || "Failed to fetch keywords",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
