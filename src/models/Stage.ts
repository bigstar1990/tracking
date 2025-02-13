import mongoose, { model, ObjectId } from "mongoose";

export interface StageDocument {
  name: string;
  text: string;
  deadlineNumber: number;
  deadlineUnit: "minutes" | "hours" | "days";
  sendEmail: boolean;
  emailContent: string;
}

export interface IStageProps extends StageDocument {
  _id: ObjectId;
}

const StageSchema = new mongoose.Schema<StageDocument>({
  name: { type: String, required: true },
  text: { type: String },
  deadlineNumber: { type: Number, default: 0 },
  deadlineUnit: { type: String, default: "minutes" },
  sendEmail: { type: Boolean, default: false },
  emailContent: { type: String },
});

const Stage =
  mongoose.models?.Stage || model<StageDocument>("Stage", StageSchema);
export default Stage;
