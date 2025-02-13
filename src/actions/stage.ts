"use server";
import { connectDB } from "@/lib/mongodb";
import Stage, { IStageProps } from "@/models/Stage";
import { ObjectId } from "mongoose";

// ✅ Add a new stage
export const addStage = async (values: Omit<IStageProps, "_id">) => {
  try {
    await connectDB();
    const stage = new Stage(values);
    const savedStage = await stage.save();
    return {
      success: "Stage added successfully",
      stage: JSON.stringify({
        _id: savedStage._id.toString(),
        ...savedStage.toObject({ getters: true, virtuals: false }),
      }),
    };
  } catch (error) {
    console.log(error);
    return { error: "Adding failed" };
  }
};

// ✅ Modify an existing stage
export const modifyStage = async (
  id: string | ObjectId,
  values: Partial<IStageProps>
) => {
  try {
    await connectDB();
    const stage = await Stage.findById(id);

    if (!stage) {
      return { error: "Stage not found" };
    }

    Object.assign(stage, values);
    const updatedStage = await stage.save();

    return {
      success: "Stage updated successfully",
      stage: JSON.stringify({
        _id: updatedStage._id.toString(),
        ...updatedStage.toObject({ getters: true, virtuals: false }),
      }),
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update stage" };
  }
};

// ✅ Remove a stage
export const removeStage = async (id: string | ObjectId) => {
  try {
    await connectDB();
    const stage = await Stage.findByIdAndDelete(id);

    if (!stage) {
      return { error: "Stage not found" };
    }

    return { success: "Stage removed successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to remove stage" };
  }
};

// ✅ Fetch all stages
export const getStages = async () => {
  try {
    await connectDB();
    const stages = await Stage.find({});

    return {
      stages: JSON.stringify(
        stages.map((stage) => ({
          _id: stage._id.toString(),
          ...stage.toObject({ getters: true, virtuals: false }),
        }))
      ),
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch stages" };
  }
};
