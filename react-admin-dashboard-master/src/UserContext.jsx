import {createContext, useEffect, useState} from "react";
import axios from "axios";
// import {data} from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get('/adminprofile').then(({data}) => {
        console.log('user profile data:', data); // add this line
        setUser(data);
        setReady(true);
      });
    }
  }, []);
  
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}