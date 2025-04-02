"use client";

import { useEffect, useRef, useState } from "react";
import {db} from "@/app/lib/firebase";
import {collection,query,where,getDocs} from "firebase/firestore";
import {useRouter} from "next/navigation";
import html2pdf from "html2pdf.js"; // Import html2pdf

interface Submission{
    userId: string;
    month: string;
    prompts: Record<string,string>; // def object with string keys and string values
    createdAt: Date;
    photos: string[];
}

export default function Newsletter({params}: {params: {month:string}}) { //accept month param
    const [submissions, setSubmissions] = useState<Submission[]>([]); //init submissions state
    const router = useRouter(); //use router to access query params
    const newsletterRef = useRef<HTMLDivElement>(null); // Ref for the newsletter content

    useEffect(()=>{
        const fetchSubmissions = async ()=> {
            // Decode the month parameter (e.g., "April-2025" stays as "April-2025")
            const decodedMonth = params.month; // Already in the format "April-2025"
            const q = query(collection(db, "submissions"), where("month", "==", decodedMonth)); //query submissions for month
            const querySnapshot = await getDocs(q); //get submissions
            const submissionsData: Submission[] = [];
            querySnapshot.forEach((doc) => {
                submissionsData.push(doc.data()as Submission); //add submission to array)
            });
            setSubmissions(submissionsData); //update state
    };
    fetchSubmissions(); 
}, [params.month]); //run effect when month changes

const handleDownloadPDF = () => {
    const element = newsletterRef.current;
    if (element) {
      html2pdf()
        .from(element)
        .set({
          margin: 1,
          filename: `newsletter_${params.month}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save();
    }
  };

 // Convert "April-2025" back to "April 2025" for display
 const displayMonth = params.month.replace("-", " "); 

return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Newsletter for {displayMonth}</h1>
      <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download as PDF
        </button>
      {submissions.length === 0 ? (
        <p>No submissions for this month yet.</p>
      ) : (
        submissions.map((submission, index) => (
          <div key={index} className="mb-8 p-4 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Submission by User {submission.userId}</h2>
            <div className="mt-4">
              {Object.entries(submission.prompts).map(([prompt, response]) => (
                <div key={prompt} className="mb-4">
                  <h3 className="text-lg font-medium">{prompt}</h3>
                  <p>{response}</p>
                </div>
              ))}
            </div>
            {submission.photos && submission.photos.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {submission.photos.map((photoURL, idx) => (
                    <img
                      key={idx}
                      src={photoURL}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}