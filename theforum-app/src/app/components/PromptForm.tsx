// src/app/components/PromptForm.tsx
"use client"; // Add this line

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const prompts = [
  "What’s your best moment this month?",
  "What’s the weirdest food you tried?",
  "Share a funny travel story.",
];

export default function PromptForm() {
  const { user } = useAuth();
  const [responses, setResponses] = useState<string[]>(Array(prompts.length).fill(""));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "submissions"), {
        userId: user.uid,
        month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        prompts: prompts.reduce((acc, prompt, index) => {
          acc[prompt] = responses[index];
          return acc;
        }, {} as Record<string, string>),
        createdAt: new Date(),
      });
      alert("Submission saved!");
      setResponses(Array(prompts.length).fill(""));
    } catch (error) {
      console.error("Error saving submission:", error);
      alert("Error saving submission.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Monthly Prompts</h2>
      {prompts.map((prompt, index) => (
        <div key={index} className="space-y-2">
          <label className="block font-medium">{prompt}</label>
          <textarea
            value={responses[index]}
            onChange={(e) => {
              const newResponses = [...responses];
              newResponses[index] = e.target.value;
              setResponses(newResponses);
            }}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}