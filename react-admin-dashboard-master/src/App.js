import { useState , useContext } from "react";
import React from 'react';
import styled from "styled-components"
import tw from 'twin.macro';
import axios from "axios";
import { Routes, Route , useLocation} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { UserContextProvider } from './UserContext';
import AdminLogin from "./scenes/Login";
import { UserContext } from "../src/UserContext";
axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;
const AppContainer  = styled.div`
${tw`
flex
flex-col
w-full
h-full


`}
`;
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { user } = useContext(UserContext);
  
  const isLoginPage = useLocation().pathname === "/adminlogin";

  return (
    <UserContextProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
                <Route path="/" element={<Team />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                
               
                <Route path="/clients" element={<Invoices />} />
                
               
               
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserContextProvider>
  );
}

export default App;
