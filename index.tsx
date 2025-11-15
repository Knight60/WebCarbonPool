// ไฟล์: index.tsx (ที่ root)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/*
        ใช้ตัวแปรพิเศษ 'import.meta.env.BASE_URL'
        Vite จะแทนที่ตัวแปรนี้ด้วยค่า '/carbonpool/' ให้เราเอง
      */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}