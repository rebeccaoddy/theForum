"use client";

import { useEffect, useRef, useState } from "react";
import {db} from "@/app/lib/firebase";
import {collection,query,where,getDocs} from "firebase/firestore";
import {useRouter} from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import html2pdf.js with SSR disabled
const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const newsletterRef = useRef<HTMLDivElement>(null); // Ref for the newsletter content
    const [issueNumber, setIssueNumber] = useState<number | null>(null); // Initialize as null

    // Unwrap the params Promise using React.useMemo()

    const resolvedParams = React.use(params);
    const month = resolvedParams.month;

    useEffect(()=>{
        const fetchSubmissions = async ()=> {
          try {
            setLoading(true);
            setError(null);
    
            const decodedMonth = month;
            console.log("Fetching submissions for month:", decodedMonth);
    
            const q = query(
              collection(db, "submissions"),
              where("month", "==", decodedMonth)
            );
            const querySnapshot = await getDocs(q);
    
            console.log("Number of documents returned:", querySnapshot.size);
            querySnapshot.forEach((doc) => {
              console.log("Document data:", doc.data());
            });
    
            const submissionsData: Submission[] = [];
            querySnapshot.forEach((doc) => {
              submissionsData.push(doc.data() as Submission);
            });
    
            console.log("Submissions data:", submissionsData);
            setSubmissions(submissionsData);
          } catch (err) {
            console.error("Error fetching submissions:", err);
            setError("Failed to load submissions. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
    fetchSubmissions(); 
}, [month]); //run effect when month changes

// Generate the issue number on the client side after the component mounts
useEffect(() => {
  setIssueNumber(Math.floor(Math.random() * 100) + 1);
}, []); // Empty dependency array to run only once on mount

const handleDownloadPDF = () => {
    const element = newsletterRef.current;
    if (element) {
      html2pdf()
        .then((html2pdfInstance: any) => {
          html2pdfInstance
            .from(element)
            .set({
              margin: [0.5, 0.5, 0.5, 0.5],
              filename: `newsletter_${month}.pdf`,
              html2canvas: { scale: 2 },
              jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            })
            .save();
        })
        .catch((err: Error) => {
          console.error("Error generating PDF:", err);
          alert("Failed to generate PDF. Please try again.");
        });
    }
  };

 // Convert "April-2025" back to "April 2025" for display
  const displayMonth = month.replace("-", " ");

 return (
  <div className="max-w-4xl mx-auto p-8 bg-white">
    {/* Download Button (outside the ref to exclude from PDF) */}
    <div className="flex justify-end mb-4">
      <button
        onClick={handleDownloadPDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading || submissions.length === 0}
      >
        Download as PDF
      </button>
    </div>

    {/* Newsletter Content (included in PDF) */}
    <div ref={newsletterRef} className="border-2 border-black p-6">
      {/* Header Section */}
      <header className="border-b-4 border-black mb-6 pb-2 text-center">
        <h1 className="text-5xl font-serif font-bold tracking-wider uppercase">
          The Forum Gazette
        </h1>
        <p className="text-lg font-serif mt-2">
            {displayMonth} | Issue #{issueNumber ?? "Loading..."}
          </p>
      </header>

      {/* Main Content */}
      {loading ? (
        <p className="text-center text-gray-600">Loading submissions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-gray-600">No submissions for this month yet.</p>
      ) : (
        <div className="columns-2 gap-6">
          {submissions.map((submission, index) => (
            <article
              key={index}
              className="mb-8 break-inside-avoid border-b border-gray-300 pb-4"
            >
              {/* Article Header */}
              <h2 className="text-2xl font-serif font-semibold mb-2">
                Traveler’s Tale: {submission.userId}
              </h2>

              {/* Prompts and Responses */}
              <div className="space-y-4">
                {Object.entries(submission.prompts).map(([prompt, response]) => (
                  <div key={prompt}>
                    <h3 className="text-lg font-serif font-medium italic text-gray-700">
                      {prompt}
                    </h3>
                    <p className="text-base font-sans text-gray-800">{response}</p>
                  </div>
                ))}
              </div>

              {/* Photos */}
              {submission.photos && submission.photos.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-serif font-medium mb-2">Snapshots</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {submission.photos.map((photoURL, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={photoURL}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-32 object-cover border border-gray-300 rounded"
                        />
                        <p className="text-xs text-center text-gray-600 mt-1">
                          Photo {idx + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <footer className="border-t-4 border-black mt-6 pt-2 text-center text-sm text-gray-600">
          <p>Published by The Forum App | Contact: </p>
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}