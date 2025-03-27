// src/app/components/SignInButton.tsx
"use client"; // Add this line

import { useAuth } from "./AuthContext";

export default function SignInButton() {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  return (
    <div className="p-4">
      {user ? (
        <button
          onClick={signOutUser}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}