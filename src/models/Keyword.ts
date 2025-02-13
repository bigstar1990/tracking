import mongoose, { Schema, Document } from "mongoose";

export interface IKeyword extends Document {
  keyword: string;
}

const KeywordSchema: Schema = new Schema(
  {
    keyword: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Keyword = mongoose.models.Keyword || mongoose.model<IKeyword>("Keyword", KeywordSchema);
export default Keyword;
