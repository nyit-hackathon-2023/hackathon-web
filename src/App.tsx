import React from 'react';
import './App.css';
import TestChatPage from "./TestChat";
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import DetailPage from "./DetailPage";
import Homepage from './components/Homepage';
import ApiKeyPage from "./ApiKeyPage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'element={<Homepage/>}></Route>
      <Route path='/detail/:disease' element={<DetailPage />} ></Route>
      <Route path='/chat' element={<TestChatPage/>} ></Route>
      <Route path='/apiKey' element={<ApiKeyPage/>} ></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
