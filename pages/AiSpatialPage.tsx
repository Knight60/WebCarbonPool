
import React, { useState } from 'react';

const layers = [
  { id: 'carbon_stock', label: 'การประเมินการสะสมคาร์บอน' },
  { id: 'land_use', label: 'การใช้ประโยชน์ที่ดิน' },
  { id: 'green_area_type', label: 'ประเภทพื้นที่สีเขียว' },
  { id: 'permanent_plots', label: 'ที่ตั้งแปลงถาวร' },
];

const AiSpatialPage: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState<string[]>(['carbon_stock', 'permanent_plots']);

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  return (
    <div className="space-y-6 th-font">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">AI Spatial Analysis</h1>
        <p className="mt-2 text-slate-600">
          แผนที่แสดงผลการวิเคราะห์เชิงพื้นที่และการประเมินการสะสมคาร์บอน
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row" style={{ height: 'calc(100vh - 20rem)' }}>
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 bg-slate-50 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-4">ชั้นข้อมูล (Layers)</h2>
            <div className="space-y-3">
              {layers.map(layer => (
                <label key={layer.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayers.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700">{layer.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-grow bg-slate-200 flex items-center justify-center relative">
            <img src="https://i.imgur.com/Za9gC2e.png" alt="Mockup map of Thailand with data layers" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <h3 className="font-bold mb-2">คำอธิบายสัญลักษณ์</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center"><div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div><span>Carbon Stock: สูง</span></div>
                <div className="flex items-center"><div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div><span>Carbon Stock: ปานกลาง</span></div>
                <div className="flex items-center"><div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div><span>Carbon Stock: ต่ำ</span></div>
                <div className="flex items-center"><div className="w-3 h-3 border-2 border-blue-600 mr-2 rounded-full"></div><span>แปลงถาวร</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSpatialPage;
