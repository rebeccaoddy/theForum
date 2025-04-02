// src/app/page.tsx
"use client"; 
import SignInButton from "@/app/components/SignInButton"; //import SignInButton component
import PromptForm from "@/app/components/PromptForm"; //import PromptForm component
import { useAuth } from "@/app/components/AuthContext"; //import custom hook to access auth context


export default function Home() { //create Home component
  const { user } = useAuth(); //use custom hook to access auth context

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">The Forum App</h1>
      {user ? (
        <>
          <p className="mb-4">Welcome, {user.displayName}!</p>
          <PromptForm />
          <SignInButton />
        </>
      ) : (
        <>
          <p className="mb-4">Please sign in to get started.</p>
          <SignInButton />
        </>
      )}
    </main>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { collection, getDocs, QuerySnapshot, DocumentData  } from "firebase/firestore";
// import { db } from "@/app/lib/firebase"; // Ensure Firebase is correctly imported
// import LoginButton from "@/app/components/LoginButton"

// interface Prompt {
//   id: string;
//   question: string;
// }

// export default function Home() {
//   const [prompts, setPrompts] = useState<Prompt[]>([]);

//   //fetch prompts from firestone 
//   useEffect(() => {
//     const fetchPrompts = async() => {
//       const promptsCollection = collection(db, "prompts");
//       const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(promptsCollection);
//       const promptsList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         question: doc.data().question as string, // Explicitly cast the question field to string
//       })) as {id:string; question:string}[];

//       setPrompts(promptsList);
//     };

//     fetchPrompts();
//   },[]);








//     // State to store users
//     // const [users, setUsers] = useState<{ id: string; name: string; msg: string }[]>([]);
//     // const [loading, setLoading] = useState(false);
//     // const [error, setError] = useState("");

//     // // Function to fetch users from Firestore
//     // const fetchUsers = async () => {
//     //     console.log("Fetching users..."); 
//     //     setLoading(true); // Show loading state
//     //     setError(""); // Reset errors

//     //     try {
//     //         // Reference the "users" collection
//     //         const usersCollection = collection(db, "users");

//     //         // Fetch all documents from the "users" collection
//     //         const querySnapshot = await getDocs(usersCollection);

//     //         // Process the documents into an array
//     //         const usersList = querySnapshot.docs.map((doc) => ({
//     //             id: doc.id,
//     //             ...doc.data(),
//     //         })) as { id: string; name: string; msg: string }[];

//     //         // Store in state
//     //         setUsers(usersList);
//     //         console.log("Users fetched:", usersList);
//     //     } catch (error) {
//     //         console.error("Error fetching users:", error);
//     //         setError("Failed to fetch users.");
//     //     } finally {
//     //         setLoading(false); // Hide loading state
//     //     }
//     // };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">The Forum App</h1>
//             <LoginButton /> {/* Add Login Button here */}

//             <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Monthly Prompts</h1>
//             <ul>
//                 {prompts.length > 0 ? (
//                     prompts.map((prompt) => (
//                         <li key={prompt.id} className="p-2 border-b">
//                             {prompt.question}
//                         </li>
//                     ))
//                 ) : (
//                     <p className="text-gray-500">No prompts found.</p>
//                 )}
//             </ul>
//         </div>

//             {/* <button
//                 onClick={fetchUsers}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                 disabled={loading}
//             >
//                 {loading ? "Loading..." : "Fetch Users"}
//             </button>

//             {error && <p className="text-red-500 mt-2">{error}</p>}

//             <ul className="mt-4">
//                 {users.length > 0 ? (
//                     users.map((user) => (
//                         <li key={user.id} className="p-2 border-b">
//                             <strong>{user.name}</strong>: {user.msg}
//                         </li>
//                     ))
//                 ) : (
//                     <p className="text-gray-500 mt-2">No users found.</p>
//                 )}
//             </ul> */}
//         </div>
        


//     );
// }