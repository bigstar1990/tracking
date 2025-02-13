import Keyword, { IKeyword } from "@/models/Keyword";
import { connectDB } from "@/lib/mongodb";

export const getKeywords = async (): Promise<IKeyword[]> => {
  await connectDB();
  return Keyword.find({});
};

export const addKeyword = async (keyword: string): Promise<IKeyword> => {
  await connectDB();
  const newKeyword = new Keyword({ keyword });
  return newKeyword.save();
};

export const removeKeyword = async (id: string): Promise<IKeyword | null> => {
  await connectDB();
  return Keyword.findByIdAndDelete(id);
};
