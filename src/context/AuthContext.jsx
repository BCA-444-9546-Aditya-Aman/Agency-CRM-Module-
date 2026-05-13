import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async(user) => {

      if(user) {

        setCurrentUser(user);

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
          setUserData(userSnap.data());
        }

      } else {

        setCurrentUser(null);

        setUserData(null);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  const logout = () => {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}