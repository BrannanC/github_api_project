import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";

import Cards from "./components/cards";
import SingleRepo from "./components/singleRepo";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={Cards} />
      <Route path="/:id" component={SingleRepo} />
    </div>
  );
}

export default App;
