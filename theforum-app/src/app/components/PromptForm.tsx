// src/app/components/PromptForm.tsx
"use client"; 

import { useState } from "react"; //import useState hook
import { db, storage } from "../lib/firebase"; //import db from firebase
import { collection, addDoc } from "firebase/firestore";//import collection and addDoc from firebase/firestore
import { useAuth } from "./AuthContext"; //import custom hook to access auth context
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const prompts = [
  "What’s your best moment this month?",
  "What’s the weirdest food you tried?",
  "Share a funny travel story.",
];

//create PromptForm component
export default function PromptForm() { 
  const { user } = useAuth(); //use custom hook to access auth context
  const [responses, setResponses] = useState<string[]>(Array(prompts.length).fill("")); //init responses array with empty strings
  const [loading, setLoading] = useState(false);//init loading state to false
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {//create async function to handle form submission
    e.preventDefault(); 
    if (!user) return; 

    setLoading(true); 
    try {

      const photoURLs = await Promise.all(
        photos.map(async (photo, index) => {
          const photoRef = ref(storage, `submissions/${user.uid}/${Date.now()}_${index}_${photo.name}`);
          await uploadBytes(photoRef, photo);
          return await getDownloadURL(photoRef);
        })
      );

      //normalze date format
      const month = new Date().toLocaleString("default", { month: "long", year: "numeric" }).replace(" ", "-"); // e.g., "April-2025"

      await addDoc(collection(db, "submissions"), { //add submission to "submissions" collection
        userId: user.uid, // Add user ID to submission
        month: month,
        prompts: prompts.reduce((acc, prompt, index) => {
          acc[prompt] = responses[index]; //add prompt and response to submission
          return acc; //return updated object
        }, {} as Record<string, string>), //init empty object
        photos: photoURLs,
        createdAt: new Date(), 
      });
      alert("Submission saved!");
      setResponses(Array(prompts.length).fill("")); //reset prompts 
      setPhotos([]);
    } catch (error) {
      console.error("Error saving submission:", error);
      alert("Error saving submission.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; //not possible if not logged in 

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Monthly Prompts</h2>
      {prompts.map((prompt, index) => (
        <div key={index} className="space-y-2">
          <label className="block font-medium">{prompt}</label>
          <textarea
            value={responses[index]} //set value to response at index pos
            onChange={(e) => {
              const newResponses = [...responses]; //copy responses array
              newResponses[index] = e.target.value; //update response at index
              setResponses(newResponses); //update state
            }}
            className="w-full p-2 border rounded"
            rows={3}
            required 
          />
        </div>
      ))}
      <div className="space-y-2">
        <label className="block font-medium">Upload Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded"
        />
      </div> 
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