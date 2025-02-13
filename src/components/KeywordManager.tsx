"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { IKeyword } from "@/models/Keyword";

// const { MODE } = process.env;

export default function KeywordManager() {
  const [keywords, setKeywords] = useState<IKeyword[]>([]);
  // const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get("/api/keywords");
        setKeywords(response.data.keywords);
      } catch (error) {
        console.error("Failed to fetch keywords", error);
      }
    };

    fetchKeywords();
  }, []);

  // const addKeyword = async () => {
  //   if (
  //     newKeyword.trim() &&
  //     !keywords.map((keyword) => keyword.keyword).includes(newKeyword.trim())
  //   ) {
  //     try {
  //       const response = await axios.post("/api/keywords", {
  //         keyword: newKeyword.trim(),
  //       });
  //       setKeywords([...keywords, response.data.keyword]);
  //       setNewKeyword("");
  //     } catch (error) {
  //       console.error("Failed to add keyword", error);
  //     }
  //   }
  // };

  // const removeKeyword = async (id: string) => {
  //   try {
  //     await axios.delete("/api/keywords", { data: { id } });
  //     setKeywords(keywords.filter((k) => k._id !== id));
  //   } catch (error) {
  //     console.error("Failed to remove keyword", error);
  //   }
  // };

  return (
    <div>
      <ul className="mb-4">
        {keywords.map((keyword, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{keyword.keyword}</span>
            {/* {MODE !== "production" && (
              <button
                onClick={() => removeKeyword(keyword._id as string)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )} */}
          </li>
        ))}
      </ul>
      {/* {MODE !== "production" && (
        <div className="flex flex-col sm:flex-row">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 border rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none px-4 py-2"
            placeholder="New keyword"
          />
          <button
            onClick={addKeyword}
            className="bg-blue-500 text-white px-4 py-2 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none"
          >
            Add
          </button>
        </div>
      )} */}
    </div>
  );
}
