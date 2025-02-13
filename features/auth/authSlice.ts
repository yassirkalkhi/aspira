import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { createSession } from "@/sessions/sessions";
import {  doc, getDoc, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { User, Profile } from "@/types/types";


interface SignupPayload {
  email: string;
  password: string;
  username: string;
  avatar: string;
  firstname: string;
  lastname: string;
}


const getFirebaseErrorMessage = (error: any): string => {
    if (error.code) {
      switch (error.code) {
        case "auth/invalid-credential":
          return "Invalid email or password.";
        case "auth/user-not-found":
          return "No user found with this email.";
        case "auth/too-many-requests":
          return "Too many failed login attempts. Try again later.";
        case "auth/popup-closed-by-user":
          return "The popup has been closed by the user before finalizing the operation.";
        case "auth/cancelled-popup-request":
          return "The popup request was canceled.";
        case "auth/account-exists-with-different-credential":
          return "An account already exists with the same email address but different sign-in credentials.";
        case "auth/user-disabled":
          return "This user account has been disabled.";
        case "auth/email-already-in-use":
          return "The email address is already in use by another account.";
        case "auth/weak-password":
          return "The password is too weak.";
        case "auth/popup-blocked":
          return "The popup was blocked by the browser.";
        default:
          return "An error occurred. Please try again.";
      }
    }else{
          return error.message;
    }
   
  };

export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password,rememberMe }:{email : string , password : string,rememberMe : Boolean}, { rejectWithValue }) => {
  try {
    if(rememberMe){
      createSession();
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
        uid : userCredential.user.uid,
        email : userCredential.user.email,
    };
  } catch (error : any) {
    return rejectWithValue(getFirebaseErrorMessage(error)); 
  }
});

export const signupWithEmail = createAsyncThunk(
  "auth/signupWithEmail",
  async ({ email, password, username, avatar, firstname, lastname }: SignupPayload, { rejectWithValue }) => {
    try {
      const usernameRef = doc(db, "profiles", username);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error("Username is already taken. Please choose another.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: User = {
        uid: user.uid,
        email,
        firstname,
        lastname,
        username,
        role: "user",
        isOnline: true,
        createdAt: Timestamp.fromDate(new Date()),
        hasProfile: true
      };

      await setDoc(doc(db, "users", user.uid), userData);

      const profileData: Profile = {
        id: user.uid,
        userId: user.uid,
        username,
        firstname,
        lastname,
        location: "",
        position: "",
        company: "",
        role: "user",
        bio: "",
        about: "",
        skills: [],
        website: "",
        followers: 0,
        following: 0,
        joinDate: Timestamp.fromDate(new Date()),
        avatar: avatar || "",
        cover: "",
        isOnline: true
      };

      await setDoc(doc(db, "profiles", user.uid), profileData);

      return {
        uid: user.uid,
        email: user.email,
        username
      };

    } catch (error: any) {
      return rejectWithValue(getFirebaseErrorMessage(error)); 
    }
  }
);


// Login with Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        await signOut(auth);
        throw new Error("No account found. Please sign up first.");
      }

      return { 
        uid: user.uid, 
        email: user.email,
        username: user.displayName || user.email 
      };
    } catch (error: any) {
      await signOut(auth);
      return rejectWithValue(getFirebaseErrorMessage(error)); 
    }
  }
);




// Signup with Google
export const signupWithGoogle = createAsyncThunk(
  "auth/signupWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const tempUserCredential = await signInWithPopup(auth, provider);
      const tempUser = tempUserCredential.user;

      if (!tempUser.email) {
        await signOut(auth);
        throw new Error("Google account has no email associated.");
      }

      const methods = await fetchSignInMethodsForEmail(auth, tempUser.email);
      if (methods.length > 0) {
        await signOut(auth);
        throw new Error("Sign up method already used");
      }

      const userDocRef = doc(db, "users", tempUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await signOut(auth);
        throw new Error("Account already exists. Please log in.");
      }

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const batch = writeBatch(db);

      const userData: User = {
        uid: user.uid,
        email: user.email!,
        firstname: user.displayName!.split(" ")[0] || "", 
        lastname: user.displayName!.split(" ")[1] || "",
        username: user.displayName || user.email!, 
        role: "user", 
        isOnline: true,
        createdAt: Timestamp.fromDate(new Date()),
        hasProfile: true
      };

      batch.set(doc(db, "users", user.uid), userData);

      const profileData: Profile = {
        id: user.uid,
        userId: user.uid,
        username: user.displayName ? `${user.displayName.split(' ')[0]}${user.displayName.split(' ')[1]}` : user.email! || "AspiraUser",
        firstname: userData.firstname,
        lastname: userData.lastname,
        location: "",
        position: "",
        company: "",
        role: "user",
        bio: "",
        about: "",
        skills: [],
        website: "",
        followers: 0,
        following: 0,
        joinDate: Timestamp.fromDate(new Date()),
        avatar: user.photoURL || "", 
        cover: "",
        isOnline: true
      };

      batch.set(doc(db, "profiles", user.uid), profileData);

      await batch.commit();

      return {
        uid: user.uid,
        email: user.email!,
        username: user.displayName || user.email!
      };

    } catch (error: any) {
      await signOut(auth);
      console.log(error)
      return rejectWithValue(getFirebaseErrorMessage(error)); 
    }
  }
);




export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null } as { user: {uid: string, email: string | null} | null, loading: boolean, error: any },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupWithEmail.pending, (state) => { state.loading = true; })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => { state.loading = true; })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })
      .addCase(signupWithGoogle.pending, (state) => { state.loading = true; })
      .addCase(signupWithGoogle.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
      })
      .addCase(signupWithGoogle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

export const listenForAuthChanges = () => async (dispatch: (arg0: { payload: any; type: "auth/setUser"; }) => void) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        dispatch(setUser({ uid: user.uid, email: user.email, role: userData?.role || "user" }));
      } else {
        dispatch(setUser({ uid: user.uid, email: user.email, role: "user" }));
      }
    } else {
      dispatch(setUser(null));
    }
  });
};
