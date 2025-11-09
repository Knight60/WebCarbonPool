
import React from 'react';
import { APIEndpoint } from '../types';
import { CodeIcon } from '../components/icons';

const apiEndpoints: APIEndpoint[] = [
  {
    name: 'Get All Survey Plots',
    method: 'GET',
    path: '/api/v1/plots',
    description: 'ดึงข้อมูลแปลงสำรวจถาวรทั้งหมด',
    exampleResponse: `[
  {
    "id": "P001",
    "type": "สวนสาธารณะ",
    "province": "เชียงใหม่",
    "region": "เหนือ",
    "latitude": 18.787,
    "longitude": 98.985
  },
  ...
]`
  },
  {
    name: 'Get Plot by ID',
    method: 'GET',
    path: '/api/v1/plots/{plotId}',
    description: 'ดึงข้อมูลแปลงสำรวจตามรหัส',
    exampleResponse: `{
  "id": "S001",
  "type": "พื้นที่สีเขียวริมเส้นทางสัญจร",
  "province": "กรุงเทพมหานคร",
  ...
}`
  },
  {
    name: 'Get Carbon Stock Estimation',
    method: 'GET',
    path: '/api/v1/carbon-stock?lat={lat}&lon={lon}',
    description: 'ดึงข้อมูลการประเมินการสะสมคาร์บอน ณ ตำแหน่งที่กำหนด',
    exampleResponse: `{
  "latitude": 13.7563,
  "longitude": 100.5018,
  "estimated_carbon_stock_ton_per_ha": 85.4,
  "confidence_level": 0.88
}`
  }
];

const OpenDataPage: React.FC = () => {
  return (
    <div className="space-y-8 th-font">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Open Data & API</h1>
        <p className="mt-2 text-slate-600">
          เข้าถึงข้อมูลโครงการผ่าน API ที่เปิดให้ใช้งาน
        </p>
      </div>

      <div className="space-y-6">
        {apiEndpoints.map((endpoint) => (
          <div key={endpoint.path} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">{endpoint.name}</h2>
              <p className="text-slate-600 mt-1">{endpoint.description}</p>
              <div className="mt-4 flex items-center gap-3 font-mono text-sm">
                <span className={`px-2 py-1 rounded-md text-xs font-bold text-white ${endpoint.method === 'GET' ? 'bg-sky-500' : 'bg-emerald-500'}`}>
                  {endpoint.method}
                </span>
                <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded">{endpoint.path}</span>
              </div>
            </div>
            <div className="bg-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <CodeIcon className="w-5 h-5" />
                <span>Example Response</span>
              </h3>
              <pre className="text-xs text-slate-100 bg-slate-800 p-4 rounded-md overflow-x-auto">
                <code>{endpoint.exampleResponse}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenDataPage;
