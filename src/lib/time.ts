import { StageDocument } from "@/models/Stage";

export const deadline2seconds = (stage: StageDocument) => {
  const seconds4unit = {
    minutes: 60,
    hours: 60 * 60,
    days: 24 * 60 * 60,
  };
  return stage.deadlineNumber * seconds4unit[stage.deadlineUnit];
};

export const addDeadline = (date: Date, stage: StageDocument): Date => {
  const secondsToAdd = deadline2seconds(stage);
  return new Date(new Date(date).getTime() + secondsToAdd * 1000);
};
