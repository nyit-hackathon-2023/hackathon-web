import React from 'react';
import './App.css';
import TestChatPage from "./TestChat";
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import DetailPage from "./DetailPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat' element={<TestChatPage/>} ></Route>
        <Route path='/detail/:disease' element={<DetailPage />} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
