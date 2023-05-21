import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ShowLoginProvider from './components/Context/ShowLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ShowLoginProvider>
      <App />
    </ShowLoginProvider>
  </BrowserRouter>

  // </React.StrictMode>
);

