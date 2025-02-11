'use client'
import { setPersistence, signOut, onAuthStateChanged, browserSessionPersistence, User, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * 🔹 Set authentication persistence
 */
export const createSession = async (): Promise<boolean> => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 🔹 Check if a user session is active.
 */
export const checkSession = async (): Promise<Boolean> => {
    return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
                auth,
                (user: User | null) => {
                    if (user) {
                        console.log(" Active session:", user.email);
                        resolve(true);
                    } else {
                        console.log("No active session detected.");
                        resolve(false);
                    }
                    unsubscribe();
                },
                (error) => {
                    console.error("Error checking session:", error);
                    reject(false);
                }
            );
    });
};

export const getSession = async (): Promise<{ id: string, email: string; }| false> => {
  return new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(
              auth,
              (user: User | null) => {
                  if (user) {
                      console.log(" Active session:", user.email);
                      resolve({ id: user.uid, email: user.email ?? '' });
                  } else {
                      console.log(" No active session detected.");
                      resolve(false);
                  }
                  unsubscribe();
              },
              (error) => {
                  console.error("Error checking session:", error);
                  reject(false);
              }
          );
  });
};

/**
 * 🔹 Destroy session by signing out.
 */
export const destroySession = async (): Promise<boolean> => {
    try {
        await signOut(auth);
        console.log(" User signed out successfully");
        return true;
    } catch (error) {
        console.error(" Failed to sign out:", error);
        return false;
    }
};
