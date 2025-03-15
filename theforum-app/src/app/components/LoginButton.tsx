// "use client";
// import { auth, provider } from "../lib/firebase";
// import { signInWithPopup, signOut } from "firebase/auth";

// export default function LoginButton({ user }) {
//   const signIn = async () => {
//     await signInWithPopup(auth, provider);
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return user ? (
//     <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
//       Logout
//     </button>
//   ) : (
//     <button onClick={signIn} className="px-4 py-2 bg-blue-500 text-white rounded">
//       Sign in with Google
//     </button>
//   );
// }

