// ไฟล์: App.tsx (ที่ root)

import React from 'react';
// 1. Import สิ่งที่ต้องใช้จาก React Router
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import SurveyPlotsPage from './pages/SurveyPlotsPage';
import SpeciesPage from './pages/SpeciesPage';
import AiSpatialPage from './pages/AiSpatialPage';
import AiTaxonomyPage from './pages/AiTaxonomyPage';
import OpenDataPage from './pages/OpenDataPage';
// 2. ลบ: import { Page } จาก types (ถ้ามี)
// 3. ลบ: useState, useMemo

const App: React.FC = () => {
  // 4. ลบ State นี้ทิ้ง
  // const [activePage, setActivePage] = useState<Page>('home');

  // 5. ลบ useMemo นี้ทิ้ง
  // const renderPage = useMemo(() => { ... });

  // 6. ใช้ 'useLocation' เพื่อเช็ค URL ปัจจุบัน
  const location = useLocation();
  const currentPath = location.pathname; // จะได้ค่าเช่น "/", "/plots", "/species"

  // 7. คง Logic การสลับ Class ของคุณไว้ โดยอิงจาก URL
  const isWidePage = currentPath === '/plots' || currentPath === '/species';
  const mainContainerClass = isWidePage ? 'max-w-full' : 'max-w-7xl';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 8. Header ไม่ต้องรับ props 'activePage' หรือ 'setActivePage' แล้ว
           (เราจะไปแก้ Header.tsx ในขั้นตอนถัดไป) 
      */}
      <Header />
      
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        <div className={`${mainContainerClass} mx-auto`}>
          {/* 9. แทนที่ {renderPage} ด้วย <Routes> */}
          <Routes>
            {/* 'index' คือ path "/" (หน้าหลัก) */}
            <Route index element={<HomePage />} />
            
            {/* กำหนด Path ให้ตรงกับหน้าที่คุณต้องการ
                (ผมใช้ชื่อสั้นๆ ตามที่คุณใช้ใน 'activePage' เดิม) 
            */}
            <Route path="plots" element={<SurveyPlotsPage />} />
            <Route path="species" element={<SpeciesPage />} />
            <Route path="spatial" element={<AiSpatialPage />} />
            <Route path="taxonomy" element={<AiTaxonomyPage />} />
            <Route path="data" element={<OpenDataPage />} />

            {/* (แนะนำ) สร้างหน้า 404 ไว้ด้วย */}
            <Route path="*" element={
              <div className="text-center py-10 th-font">
                <h1 className="text-2xl font-bold">404: ไม่พบหน้านี้</h1>
              </div>
            } />
          </Routes>
        </div>
      </main>
      <footer className="bg-white mt-auto py-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; 2025 Department of Climate Change and Environment & Kasetsart University. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;