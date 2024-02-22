import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import firebase, { app } from "./firebase";

export const login = async ({ email, password }) => {
  const auth = getAuth(app);
  return signInWithEmailAndPassword(auth, email, password);
};

export const getCurrentUser = async () => {
  const auth = getAuth();
  return auth.currentUser;
};

export const logout = async () => {
  const auth = getAuth();
  return signOut(auth);
};

export const requestResetPassword = async (email) => {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email);
};

export const resetPassword = async (email, code, password) => {
  const auth = getAuth();
  const valid = await verifyPasswordResetCode(auth, code);
  if (valid) {
    const user = auth?.currentUser;
    console.log("[DEBUG] :: ", { user });
    updatePassword(user, password);
    return { status: true, message: "success" };
  }

  return { status: true, message: "failed" };
};
