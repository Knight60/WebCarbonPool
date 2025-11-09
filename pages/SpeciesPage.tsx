import React, { useState, useMemo } from 'react';
import { Species } from '../types';
import { useSpeciesData } from '../hooks/useSpeciesData';

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Species;
  direction: SortDirection;
}

const SpeciesPage: React.FC = () => {
  const { species: allSpecies, loading, error } = useSpeciesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'no', direction: 'ascending' });

  const filteredSpecies = useMemo(() => {
    if (!searchTerm) return allSpecies;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allSpecies.filter(s => 
      s.thaiName.toLowerCase().includes(lowercasedFilter) ||
      s.botanicalName.toLowerCase().includes(lowercasedFilter) ||
      s.family.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, allSpecies]);

  const sortedFilteredSpecies = useMemo(() => {
    let sortableItems = [...filteredSpecies];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

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
  }, [filteredSpecies, sortConfig]);

  const requestSort = (key: keyof Species) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnKey: keyof Species) => {
    if (sortConfig?.key !== columnKey) {
      return <span className="opacity-0 group-hover:opacity-50 text-slate-400 text-xs">▲</span>;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const SortableHeaderCell: React.FC<{ columnKey: keyof Species; title: string; align?: 'left' | 'right' | 'center' }> = ({ columnKey, title, align = 'left' }) => {
    const alignmentClass = align === 'right' ? 'justify-end' : (align === 'center' ? 'justify-center' : 'justify-start');
    return (
      <th scope="col" className={`px-3 py-3 text-${align} text-sm font-bold text-white whitespace-nowrap`}>
        <button type="button" onClick={() => requestSort(columnKey)} className={`flex items-center gap-1 group w-full ${alignmentClass}`}>
          <span>{title}</span>
          <span className="text-xs">{getSortIndicator(columnKey)}</span>
        </button>
      </th>
    );
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return <span className="text-slate-400">-</span>;
    return num % 1 === 0 ? num.toLocaleString() : num.toFixed(2);
  };

  return (
    <div className="th-font flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-shrink-0">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-800">ข้อมูลชนิดพันธุ์</h1>
          <p className="mt-2 text-slate-600">
            ฐานข้อมูลชนิดพันธุ์ที่พบในแปลงสำรวจถาวร ({allSpecies.length > 0 ? allSpecies.length : ''} ชนิด)
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-t-xl shadow-sm border-b border-slate-200">
          <input
            type="text"
            placeholder="ค้นหาชนิดพันธุ์ (ชื่อไทย, ชื่อวิทยาศาสตร์, วงศ์...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            aria-label="ค้นหาชนิดพันธุ์"
          />
        </div>
      </div>

      <div className="flex-grow overflow-auto bg-white rounded-b-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-700 sticky top-0 z-10">
            <tr>
              <SortableHeaderCell columnKey="no" title="ลำดับ" align="right" />
              <SortableHeaderCell columnKey="thaiName" title="ชื่อไทย" />
              <SortableHeaderCell columnKey="botanicalName" title="ชื่อวิทยาศาสตร์" />
              <SortableHeaderCell columnKey="family" title="วงศ์" />
              <SortableHeaderCell columnKey="woodDensity" title="Wood Density" align="right" />
              <SortableHeaderCell columnKey="countGbh2023" title="Count 2023" align="right" />
              <SortableHeaderCell columnKey="countGbh2025" title="Count 2025" align="right" />
              <SortableHeaderCell columnKey="minHeight2023" title="Min Height 2023" align="right" />
              <SortableHeaderCell columnKey="meanHeight2023" title="Mean Height 2023" align="right" />
              <SortableHeaderCell columnKey="maxHeight2023" title="Max Height 2023" align="right" />
              <SortableHeaderCell columnKey="minHeight2025" title="Min Height 2025" align="right" />
              <SortableHeaderCell columnKey="meanHeight2025" title="Mean Height 2025" align="right" />
              <SortableHeaderCell columnKey="maxHeight2025" title="Max Height 2025" align="right" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center py-16 text-slate-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    <span className="ml-4">กำลังโหลดข้อมูล...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={13} className="text-center py-16 text-red-500">
                  <p>{error}</p>
                </td>
              </tr>
            ) : sortedFilteredSpecies.length > 0 ? (
              sortedFilteredSpecies.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-50 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{s.no}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{s.thaiName}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 italic">{s.botanicalName}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{s.family}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.woodDensity)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.countGbh2023)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.countGbh2025)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.minHeight2023)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.meanHeight2023)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.maxHeight2023)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.minHeight2025)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.meanHeight2025)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 font-mono text-right">{formatNumber(s.maxHeight2025)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="text-center py-16 text-slate-500">
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

export default SpeciesPage;
