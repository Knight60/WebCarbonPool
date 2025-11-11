// pages/SurveyPlotsPage.tsx
import React, { useState, useMemo } from 'react';
// 1. แก้ไข Path ให้ถูกต้อง (ถอยกลับ 1 ขั้น)
import { Plot } from '../types'; 
// import { MapPinIcon } from '../components/icons'; // <-- ลบ import นี้
import { useSurveyData } from '../hooks/useSurveyData';
import { useIVI } from '../hooks/useIVI';
import { IviModal } from './IviModal'; // <-- 2. Import จากโฟลเดอร์เดียวกัน

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Plot;
  direction: SortDirection;
}

// 3. ฝังโค้ด SVG ของ MapPinIcon (หมุดปัก) ลงไปตรงนี้
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const SurveyPlotsPage: React.FC = () => {
  // --- นี่คือ Logic ทั้งหมดที่ต้องมี ---
  const { plots: allPlots, loading, error } = useSurveyData();
  const { plots: iviData, loading: iviLoading, error: iviError } = useIVI();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'no', direction: 'ascending' });
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const filteredPlots = useMemo(() => {
    if (!searchTerm) return allPlots;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allPlots.filter(plot => 
      plot.id.toLowerCase().includes(lowercasedFilter) ||
      plot.name.toLowerCase().includes(lowercasedFilter) ||
      plot.province.toLowerCase().includes(lowercasedFilter) ||
      plot.amphoe.toLowerCase().includes(lowercasedFilter) ||
      plot.tambon.toLowerCase().includes(lowercasedFilter) ||
      plot.region.toLowerCase().includes(lowercasedFilter) ||
      plot.type.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, allPlots]);

  const sortedFilteredPlots = useMemo(() => {
    let sortableItems = [...filteredPlots];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'biomass') {
          const numA = parseFloat(String(aValue).replace(/,/g, ''));
          const numB = parseFloat(String(bValue).replace(/,/g, ''));
          if (isNaN(numA) || isNaN(numB)) return 0;
          if (numA < numB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (numA > numB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue, 'th-TH')
            : bValue.localeCompare(aValue, 'th-TH');
        }

        return 0;
      });
    }
    return sortableItems;
  }, [filteredPlots, sortConfig]);

  const requestSort = (key: keyof Plot) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnKey: keyof Plot) => {
    if (sortConfig?.key !== columnKey) {
      return <span className="opacity-0 group-hover:opacity-50 text-slate-400 text-xs">▲</span>;
    }
    if (sortConfig.direction === 'ascending') {
      return <span className="opacity-100 text-xs">▲</span>;
    }
    return <span className="opacity-100 text-xs">▼</span>;
  };

  const SortableHeaderCell: React.FC<{ columnKey: keyof Plot; title: string; align?: 'left' | 'right' | 'center' }> = ({ columnKey, title, align = 'left' }) => {
    const alignmentClass = align === 'right' ? 'justify-end' : (align === 'center' ? 'justify-center' : 'justify-start');
    return (
      <th scope="col" className={`px-3 py-3 text-${align} text-sm font-bold text-white`}>
        <button type="button" onClick={() => requestSort(columnKey)} className={`flex items-center gap-1 group w-full ${alignmentClass}`}>
          <span>{title}</span>
          {getSortIndicator(columnKey)}
        </button>
      </th>
    );
  };

  const filteredIviData = useMemo(() => {
    if (!selectedPlotId) {
      return [];
    }
    // นี่คือ Logic ที่แก้บั๊กครั้งก่อน (ที่ใช้ parser ผิด)
    // ตรวจสอบให้แน่ใจว่า useIVI.ts ใช้ parseIviData นะครับ
    return iviData.filter((item: any) => item.Plot === selectedPlotId);
  }, [selectedPlotId, iviData]);
  // --- จบส่วน Logic ---

  return (
    <div className="th-font flex flex-col h-[calc(100vh-12rem)] p-4">
      
      {/* ส่วนหัว */}
      <div className="flex-shrink-0">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-800">แปลงสำรวจถาวร</h1>
          <p className="mt-2 text-slate-600">
            ข้อมูลแปลงสำรวจถาวรทั้งหมด {allPlots.length > 0 ? allPlots.length : ''} แปลงทั่วประเทศ
          </p>
        </div>
        
        {/* ช่องค้นหา */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-b border-slate-200 sticky top-0 z-20">
          <input
            type="text"
            placeholder="ค้นหาแปลง (รหัส, ชื่อ, จังหวัด...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            aria-label="ค้นหาข้อมูล"
          />
          <p className="text-xs text-slate-500 mt-2">
            * คลิกที่แถวของแปลงเพื่อดูข้อมูล IVI
          </p>
        </div>
      </div>

      {/* ตารางแปลงสำรวจหลัก */}
      <div className="flex-grow overflow-auto bg-white rounded-xl shadow-sm mt-4">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-700 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3 text-center text-sm font-bold text-white">GMap</th>
              <SortableHeaderCell columnKey="no" title="ลำดับ" />
              <SortableHeaderCell columnKey="id" title="รหัสแปลง" />
              <SortableHeaderCell columnKey="name" title="ชื่อแปลง" />
              <SortableHeaderCell columnKey="province" title="จังหวัด" />
              <SortableHeaderCell columnKey="amphoe" title="อำเภอ" />
              <SortableHeaderCell columnKey="tambon" title="ตำบล" />
              <SortableHeaderCell columnKey="type" title="ประเภท" />
              <SortableHeaderCell columnKey="lat" title="LAT" align="right" />
              <SortableHeaderCell columnKey="lon" title="LON" align="right" />
              <SortableHeaderCell columnKey="tagCount" title="จำนวนต้น" align="right" />
              <SortableHeaderCell columnKey="spCount" title="จำนวนชนิด" align="right" />
              <SortableHeaderCell columnKey="shannon" title="Shannon" align="right" />
              <SortableHeaderCell columnKey="biomass" title="Biomass" align="right" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={14} className="text-center py-16 text-slate-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    <span className="ml-4">กำลังโหลดข้อมูลแปลง...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
               <tr><td colSpan={14} className="text-center py-16 text-red-500"><p>{error}</p></td></tr>
            ) : sortedFilteredPlots.length > 0 ? (
              sortedFilteredPlots.map((plot) => (
                <tr 
                  key={plot.id} 
                  className={`hover:bg-emerald-50 transition-colors cursor-pointer ${
                    selectedPlotId === plot.id ? 'bg-emerald-100' : ''
                  }`}
                  onClick={() => setSelectedPlotId(plot.id)} // <--- คลิกเพื่อเปิด Modal
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                    <a href={plot.gmap} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 inline-block" aria-label={`View map for ${plot.name}`}>
                      <MapPinIcon className="h-6 w-6" />
                    </a>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{plot.no}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{plot.id}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate" title={plot.name}>{plot.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{plot.province}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{plot.amphoe}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{plot.tambon}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{plot.type}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{plot.lat.toFixed(5)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{plot.lon.toFixed(5)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{plot.tagCount.toLocaleString()}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{plot.spCount.toLocaleString()}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{plot.shannon.toFixed(2)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{plot.biomass}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="text-center py-16 text-slate-500">
                  <p>ไม่พบข้อมูลแปลงที่ตรงกับการค้นหา</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. ส่วน Modal (จะแสดงทับเมื่อ selectedPlotId ไม่ใช่ null) */}
      {selectedPlotId && (
        <IviModal
          plotId={selectedPlotId}
          data={filteredIviData}
          loading={iviLoading}
          error={iviError}
          onClose={() => setSelectedPlotId(null)}
        />
      )}
    </div>
  );
};

export default SurveyPlotsPage;