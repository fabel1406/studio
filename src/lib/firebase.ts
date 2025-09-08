// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  authDomain: process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.replace('supabase.co', 'firebaseapp.com') : undefined,
  projectId: process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0] : undefined,
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]}.appspot.com` : undefined,
  messagingSenderId: "1234567890", // This can be a placeholder
  appId: `1:${"1234567890"}:web:placeholder`, // This can be a placeholder
  measurementId: "G-XXXXXXXXXX", // This can be a placeholder
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };
