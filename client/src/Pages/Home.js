import React, { useState, useContext } from "react";
import { UserContext } from "../App";

const Home = () => {
  const { name } = useContext(UserContext);
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome {name}</p>
    </div>
  );
};

export default Home;
