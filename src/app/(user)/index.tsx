/*
 * This file is part of Meal Manager.
 *
 * Meal Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meal Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meal Manager. If not, see <http://www.gnu.org/licenses/>.
 */

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

