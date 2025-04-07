import React, { useEffect, useState, createContext } from "react";
import { Redirect } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";



export default function IndexScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  

  // used for testing login
  // console.log(user)

  if (isLoading) return null; // Avoid rendering until we know the user's auth state

  if (!user || user == null) {
    return <Redirect href="/(auth)/sign-in" />;
  }else{
    return <Redirect href="/(user)/MainDashboard" />;
  }
  
}

