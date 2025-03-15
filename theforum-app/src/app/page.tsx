"use client";

import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Ensure Firebase is correctly imported

export default function Home() {
    // State to store users
    const [users, setUsers] = useState<{ id: string; name: string; msg: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Function to fetch users from Firestore
    const fetchUsers = async () => {
        console.log("Fetching users..."); 
        setLoading(true); // Show loading state
        setError(""); // Reset errors

        try {
            // Reference the "users" collection
            const usersCollection = collection(db, "users");

            // Fetch all documents from the "users" collection
            const querySnapshot = await getDocs(usersCollection);

            // Process the documents into an array
            const usersList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as { id: string; name: string; msg: string }[];

            // Store in state
            setUsers(usersList);
            console.log("Users fetched:", usersList);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Users List</h1>
            <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                disabled={loading}
            >
                {loading ? "Loading..." : "Fetch Users"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <ul className="mt-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="p-2 border-b">
                            <strong>{user.name}</strong>: {user.msg}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 mt-2">No users found.</p>
                )}
            </ul>
        </div>
    );
}
