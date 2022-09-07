import React from "react";

import './App.css';

import {BrowserRouter as Router} from 'react-router-dom';


import logo from './assets/logo.svg';

import Routes from './routes';

function App() {
  return(
    <Router>

            <Routes/>
      
    </Router>
  );
}

export default App;
