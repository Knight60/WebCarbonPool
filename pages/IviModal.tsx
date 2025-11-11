import React from 'react';
// 1. แก้ไข path นี้
import { XMarkIcon } from '../src/components/icons'; // (สมมติว่าไฟล์ icons อยู่ใน src/components)

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
    // ... (โค้ดที่เหลือเหมือนเดิม) ...
    <div
      className="th-font fixed inset-0 z-40 flex justify-end bg-black bg-opacity-50 transition-opacity"
      onClick={onClose} 
    >
      <div
        className="relative flex h-full w-full max-w-3xl flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* ... (โค้ดที่เหลือเหมือนเดิม) ... */}
      </div>
    </div>
  );
};