"use server";
import {  db } from "@/lib/firebase";
import {  collection, getDocs, query, where } from 'firebase/firestore';




  export async function checkUsernameAvailability(username: string): Promise<boolean> {
    console.log("username :" ,username)
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef,where("username", "==", username));
      const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
    } catch (error: any) {
      console.error("Error checking username availability: ", error);
      return false;
    }
  }
