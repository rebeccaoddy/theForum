"use client"; // Needed for Firebase authentication in Next.js

import {useState, useEffect} from "react"; 
import {auth,provider} from "@/app/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";


export default function LoginButton(){
    const[user,setUser] = useState<User| null>(null); //create state variable "User"; init to null (no login)

    // listen for auth state changes 
    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=> {setUser(currentUser);
        });
        return() => unsubscribe();
    },[]);

    //Google Sign in 
    const signIn = async() => {
        try {
            await signInWithPopup(auth,provider);
        } catch(error){
            console.error("Login failed:", error);
        }
    };

    //logout
    const logout = async()=> {
        try {
            await signOut(auth);
        }
        catch (error) {
            console.error("Login failed:", error);
        }
    };

    //handle page formatting and rendering 
    return (
        <div className = "flex flex-col items-center"> 
            {user ? (
                <>
                <p> Welcome, {user.displayName}!</p>
                <button 
                    onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2"
                >
                    Logout
                </button>
                </>
            ):(
                <button 
                    onClick={signIn} className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Sign In with Google
                </button>
            )}
        </div>
    );

}

