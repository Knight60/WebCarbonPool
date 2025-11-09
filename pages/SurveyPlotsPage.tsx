import React, { useState, useMemo } from 'react';
import { Plot } from '../types';
import { MapPinIcon } from '../components/icons';
import { useSurveyData } from '../hooks/useSurveyData';

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Plot;
  direction: SortDirection;
}

const SurveyPlotsPage: React.FC = () => {
  const { plots: allPlots, loading, error } = useSurveyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'no', direction: 'ascending' });

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

  return (
    <div className="th-font flex flex-col h-[calc(100vh-12rem)]">
      
      <div className="flex-shrink-0">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-800">แปลงสำรวจถาวร</h1>
          <p className="mt-2 text-slate-600">
            ข้อมูลแปลงสำรวจถาวรทั้งหมด {allPlots.length > 0 ? allPlots.length : ''} แปลงทั่วประเทศ
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-t-xl shadow-sm border-b border-slate-200">
          <input
            type="text"
            placeholder="ค้นหาแปลง (รหัส, ชื่อ, จังหวัด, อำเภอ...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            aria-label="ค้นหาแปลงสำรวจ"
          />
        </div>
      </div>

      <div className="flex-grow overflow-auto bg-white rounded-b-xl shadow-sm">
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
                    <span className="ml-4">กำลังโหลดข้อมูล...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={14} className="text-center py-16 text-red-500">
                  <p>{error}</p>
                </td>
              </tr>
            ) : sortedFilteredPlots.length > 0 ? (
              sortedFilteredPlots.map((plot) => (
                <tr key={plot.id} className="hover:bg-emerald-50 transition-colors">
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
                  <p>ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyPlotsPage;
