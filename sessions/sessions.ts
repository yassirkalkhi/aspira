'use client'
import { setPersistence, signOut, onAuthStateChanged, browserSessionPersistence, User, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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


export const checkRole = async (role: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (user: User | null) => {
                if (user) {
                    try {
                        const db = getFirestore();
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            if (userData.role === role) {
                                console.log(`User has the role: ${role}`);
                                resolve(true);
                            } else {
                                console.log(`User does not have the role: ${role}`);
                                resolve(false);
                            }
                        } else {
                            console.log("No user data found.");
                            resolve(false);
                        }
                    } catch (error) {
                        console.error("Error fetching user role:", error);
                        reject(false);
                    }
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
