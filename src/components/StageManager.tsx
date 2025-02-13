import { useState, useEffect } from "react";
import { addStage, modifyStage, removeStage, getStages } from "@/actions/stage";
import { IStageProps, StageDocument } from "@/models/Stage";
import { ObjectId } from "mongoose";

export default function StageManager() {
  const [stages, setStages] = useState<IStageProps[]>([]);
  const [stageEditId, setStageEditId] = useState<string | ObjectId | null>(
    null
  );
  const defaultNewStage: StageDocument = {
    name: "",
    text: "",
    deadlineNumber: 0,
    deadlineUnit: "minutes",
    sendEmail: false,
    emailContent: "",
  };
  const [newStage, setNewStage] = useState<StageDocument>(defaultNewStage);

  useEffect(() => {
    const fetchStages = async () => {
      const result = await getStages();
      if (!result.error && result.stages) {
        setStages(JSON.parse(result.stages));
      }
    };
    fetchStages();
  }, []);

  const handleAddStage = async () => {
    if (newStage.name.trim() && newStage.text.trim()) {
      const result = await addStage(newStage);
      if (!result.error) {
        setStages([...stages, JSON.parse(result.stage as string)]);
        setNewStage(defaultNewStage);
      }
    }
  };

  const handleUpdateStage = async (
    id: ObjectId,
    field: keyof StageDocument,
    value: string | number | boolean
  ) => {
    const updatedStages = stages.map((stage) =>
      stage._id === id ? { ...stage, [field]: value } : stage
    );
    setStages(updatedStages);
    await modifyStage(id, { [field]: value });
  };

  const handleEditStage = async (id: string | ObjectId) => {
    setStageEditId(id);
  };

  const handleDeleteStage = async (id: string | ObjectId) => {
    const result = await removeStage(id);
    if (!result.error) {
      setStages(stages.filter((stage) => stage._id !== id));
    }
  };

  return (
    <div>
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {stages.map((stage, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="10"
              >
                <path
                  fillRule="nonzero"
                  d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                />
              </svg>
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
              {stageEditId === stage._id ? (
                <>
                  <div
                    key={stage._id.toString()}
                    className="border-b pb-4 mb-4"
                  >
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) =>
                        handleUpdateStage(stage._id, "name", e.target.value)
                      }
                      className="border px-4 py-2 w-full mb-2"
                      placeholder="Stage Name"
                    />
                    <textarea
                      value={stage.text}
                      onChange={(e) =>
                        handleUpdateStage(stage._id, "text", e.target.value)
                      }
                      className="border px-4 py-2 w-full mb-2"
                      placeholder="Display Text"
                    ></textarea>
                    <div className="flex items-center mb-2">
                      <input
                        type="number"
                        value={stage.deadlineNumber || ""}
                        onChange={(e) =>
                          handleUpdateStage(
                            stage._id,
                            "deadlineNumber",
                            e.target.value
                          )
                        }
                        className="border px-4 py-2 flex-1"
                        placeholder="Deadline Number"
                      />
                      <select
                        value={stage.deadlineUnit}
                        onChange={(e) =>
                          handleUpdateStage(
                            stage._id,
                            "deadlineUnit",
                            e.target.value
                          )
                        }
                        className="border px-4 py-2 ml-2"
                      >
                        <option value="">Select Unit</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={stage.sendEmail}
                        onChange={(e) =>
                          handleUpdateStage(
                            stage._id,
                            "sendEmail",
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <label>Send Email</label>
                    </div>
                    {stage.sendEmail && (
                      <textarea
                        value={stage.emailContent}
                        onChange={(e) =>
                          handleUpdateStage(
                            stage._id,
                            "emailContent",
                            e.target.value
                          )
                        }
                        className="border px-4 py-2 w-full"
                        placeholder="Email Content"
                      ></textarea>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900">{stage.name}</div>
                  </div>
                  <div className="text-slate-500">{`Display text: ${stage.text}`}</div>
                  <div className="text-slate-500">{`Deadline: ${stage.deadlineNumber} ${stage.deadlineUnit}`}</div>
                  <div className="text-slate-500">{`Send email: ${
                    stage.sendEmail ? "Yes" : "No"
                  }`}</div>
                  {stage.sendEmail && (
                    <div className="text-slate-500">{stage.emailContent}</div>
                  )}
                </>
              )}

              <div className="flex flex-row justify-end gap-8 items-center">
                {stageEditId === stage._id ? (
                  <button
                    onClick={() => setStageEditId(null)}
                    className="text-green-500 hover:underline mt-2"
                  >
                    Save Stage
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditStage(stage._id)}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    Edit Stage
                  </button>
                )}

                <button
                  onClick={() => handleDeleteStage(stage._id)}
                  className="text-red-500 hover:underline mt-2"
                >
                  Delete Stage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-4">Add New Stage</h3>
      <div>
        <input
          type="text"
          value={newStage.name}
          onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
          className="border px-4 py-2 w-full mb-2"
          placeholder="Stage Name"
        />
        <textarea
          value={newStage.text}
          onChange={(e) => setNewStage({ ...newStage, text: e.target.value })}
          className="border px-4 py-2 w-full mb-2"
          placeholder="Display Text"
        ></textarea>
        <div className="flex items-center mb-2">
          <input
            type="number"
            value={newStage.deadlineNumber}
            onChange={(e) =>
              setNewStage({
                ...newStage,
                deadlineNumber: Number(e.target.value),
              })
            }
            className="border px-4 py-2 flex-1"
            placeholder="Deadline Number"
          />
          <select
            value={newStage.deadlineUnit}
            onChange={(e) =>
              setNewStage({
                ...newStage,
                deadlineUnit: e.target.value as "minutes" | "hours" | "days",
              })
            }
            className="border px-4 py-2 ml-2"
          >
            <option value="">Select Unit</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={newStage.sendEmail}
            onChange={(e) =>
              setNewStage({ ...newStage, sendEmail: e.target.checked })
            }
            className="mr-2"
          />
          <label>Send Email</label>
        </div>
        <textarea
          value={newStage.emailContent}
          onChange={(e) =>
            setNewStage({ ...newStage, emailContent: e.target.value })
          }
          className="border px-4 py-2 w-full mb-2"
          placeholder="Email Content"
        ></textarea>
        <button
          onClick={handleAddStage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Stage
        </button>
      </div>
    </div>
  );
}
