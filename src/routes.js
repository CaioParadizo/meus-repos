import React from "react"; 
import { BrowserRouter, Route, Routes} from "react-router-dom";

import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";
import Erro from "./pages/Erro";

export default function RoutesApp() {
  return (
    <BrowserRouter>
        <Routes>    
            <Route path="/" element={<Main/>}/>
            <Route path="/repositorio/:repositorio" element={<Repositorio/>}/>
            <Route path="*" element={<Erro/>}/>
        </Routes>   
    </BrowserRouter>
  );
}       