import "./App.css";
import Routers from "./Routers";
import React, { useState, createContext } from "react";

export const UserContext = createContext();
function App() {
  return (
    <UserContext.Provider value={{ name: "John Doe" }}>
      <Routers />
    </UserContext.Provider>
  );
}

export default App;
