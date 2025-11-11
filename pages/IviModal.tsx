// pages/IviModal.tsx
import React from 'react';

interface IviModalProps {
  plotId: string;
  data: any[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export const IviModal: React.FC<IviModalProps> = ({
  plotId,
  data,
  loading,
  error,
  onClose,
}) => {
  return (
    // 1. Backdrop (พื้นหลัง) - เต็มจอเหมือนเดิม
    <div
      className="th-font fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      {/* 2. Panel (หน้าต่าง Modal) - แก้ไข className ที่นี่ */}
      <div
        // เปลี่ยน bottom-0 เป็น bottom-[100px]
        className="fixed top-[250px] bottom-[100px] right-[50px] left-[500px] flex flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ส่วนหัว Modal */}
        <div className="flex-shrink-0 border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              ข้อมูล IVI - แปลง {plotId}
            </h2>
            
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ส่วนเนื้อหา (ตาราง IVI) */}
        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-sky-800 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-sm font-bold text-white">ลำดับ</th>
                <th scope="col" className="px-3 py-3 text-left text-sm font-bold text-white">ชื่อไทย</th>
                <th scope="col" className="px-3 py-3 text-left text-sm font-bold text-white">ชื่อวิทยาศาสตร์</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">IVI (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">RD (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">RBA (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">จำนวนต้น</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">TDensity (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">BA Sum (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">GBH Avg (2025)</th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-bold text-white">PiLnPi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
                      <span className="ml-4">กำลังโหลดข้อมูล IVI...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-red-500">
                    <p>{error}</p>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item: any, index: number) => (
                  <tr key={`${item.Plot}-${item.No}-${index}`} className="hover:bg-sky-50 transition-colors">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{item.No}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{item.Thai_Name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 italic">{item.Botanical_NoAuthor}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.IVI_2025}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.RD_2025}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.RBA_2025}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.Count_Tag}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.TDensity_2025}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.BA_2025_Sum}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.GBH_2025_Avg}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.PiLnPi}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-slate-500">
                    <p>ไม่พบข้อมูลพันธุ์ไม้สำหรับแปลง {plotId}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};