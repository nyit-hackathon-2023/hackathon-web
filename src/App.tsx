import React from 'react';
import './App.css';
import TestChatPage from "./TestChat";
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/chat' element={<TestChatPage/>} ></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
