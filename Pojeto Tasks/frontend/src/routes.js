import React from "react";
import {Route, Routes } from "react-router-dom";

//importações das rotas do usuario;
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function MainRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}