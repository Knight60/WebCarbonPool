import React, { useState, useEffect } from 'react';
import { CodeIcon } from '../components/icons';

interface WMSLayer {
  name: string;
  title: string;
  abstract: string;
}

interface ApiTable {
  name: string;
  description: string;
  path: string;
}

const getWmsImageUrl = (layerName: string) => {
  const baseUrl = 'https://aigreen.dcce.go.th/geoserver/ows';
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.3.0',
    request: 'GetMap',
    layers: layerName,
    bbox: '5.5,97.0,20.5,106.0',
    width: '120',
    height: '200',
    crs: 'EPSG:4326',
    format: 'image/png',
    styles: '',
    transparent: 'true',
  });
  return `${baseUrl}?${params.toString()}`;
};

const getWmsDemoUrl = (layerName: string) => {
  const baseUrl = 'https://aigreen.dcce.go.th/geoserver/aigreen/wms';
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.0',
    request: 'GetMap',
    layers: layerName,
    bbox: '325178.8454999998,620860.6024999991,1213658.8454999998,2263240.602499999',
    width: '415',
    height: '768',
    srs: 'EPSG:32647',
    styles: '',
    format: 'application/openlayers',
  });
  return `${baseUrl}?${params.toString()}`;
};

const getRestApiDemoUrl = (apiPath: string) => {
  const baseUrl = 'https://aigreen.dcce.go.th';
  return `${baseUrl}${apiPath}?limit=10`;
};

const OpenDataPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'tables'>('layers');
  const [wmsLayers, setWmsLayers] = useState<WMSLayer[]>([]);
  const [tableData, setTableData] = useState<ApiTable[]>([]);
  const [isLoadingLayers, setIsLoadingLayers] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(true);

  useEffect(() => {
    const fetchWmsLayers = async () => {
      try {
        const response = await fetch('https://aigreen.dcce.go.th/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities');
        const text = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        const layerElements = xmlDoc.querySelectorAll('Capability > Layer > Layer');
        const layers: WMSLayer[] = [];

        layerElements.forEach(layer => {
          const name = layer.querySelector('Name')?.textContent || '';
          const title = layer.querySelector('Title')?.textContent || '';
          const abstract = layer.querySelector('Abstract')?.textContent || 'ไม่มีคำอธิบาย';
          
          if (name && title) {
            layers.push({ name, title, abstract });
          }
        });
        
        setWmsLayers(layers);
      } catch (error) {
        console.error('Failed to fetch WMS layers:', error);
      } finally {
        setIsLoadingLayers(false);
      }
    };

    const fetchTables = async () => {
      try {
        const response = await fetch('https://aigreen.dcce.go.th/rest/');
        const spec = await response.json();
        const tables: ApiTable[] = [];

        if (spec.paths) {
          for (const path in spec.paths) {
            if (path.startsWith('/') && !path.includes('?') && path !== '/' && !path.startsWith('/rpc/')) {
              const pathData = spec.paths[path];
              const description = pathData.get?.summary || pathData.get?.description || 'ไม่มีคำอธิบาย';
              
              tables.push({
                name: path.substring(1),
                description: description,
                path: `/rest${path}`
              });
            }
          }
        }
        setTableData(tables);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      } finally {
        setIsLoadingTables(false);
      }
    };

    fetchWmsLayers();
    fetchTables();
  }, []);

  const renderTabButton = (tabName: 'layers' | 'tables', title: string) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-6 py-3 font-semibold -mb-px ${
          isActive
            ? 'text-sky-600 border-b-2 border-sky-600'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {title}
      </button>
    );
  };

  return (
    <div className="space-y-8 th-font">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Open Data & API</h1>
        <p className="mt-2 text-slate-600">
          เข้าถึงข้อมูลโครงการผ่าน API และ WMS ที่เปิดให้ใช้งาน
        </p>
      </div>

      <div className="flex border-b border-slate-200">
        {renderTabButton('layers', 'ข้อมูลแผนที่ (layers)')}
        {renderTabButton('tables', 'ข้อมูลตาราง (tables)')}
      </div>

      <div className="mt-6">
        {activeTab === 'layers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">ชั้นข้อมูล WMS (Web Map Service)</h2>
            {isLoadingLayers && <p className="text-slate-600 text-center">กำลังโหลดชั้นข้อมูล WMS...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wmsLayers.map(layer => (
                <div key={layer.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 flex flex-col">
                  <img
                    src={getWmsImageUrl(layer.name)}
                    alt={`ตัวอย่าง ${layer.title}`}
                    className="w-full h-48 object-contain bg-slate-100"
                    loading="lazy"
                  />
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-900">{layer.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 h-20 overflow-y-auto flex-grow">
                      {layer.abstract}
                    </p>
                    <a
                      href={getWmsDemoUrl(layer.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="เปิดตัวอย่าง OpenLayers"
                    >
                      <pre className="text-xs text-slate-700 bg-slate-100 p-2 rounded-md mt-3 overflow-x-auto hover:bg-slate-200 transition-colors cursor-pointer">
                        <code>{layer.name}</code>
                      </pre>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">ข้อมูลตาราง (API Endpoints)</h2>
            {isLoadingTables && <p className="text-slate-600 text-center">กำลังโหลดข้อมูลตาราง...</p>}
            {tableData.map((table) => (
              <div key={table.path} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900">{table.name}</h2>
                  <p className="text-slate-600 mt-1">{table.description}</p>
                  <div className="mt-4 flex items-center gap-3 font-mono text-sm">
                    <a
                      href={getRestApiDemoUrl(table.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="เปิดตัวอย่าง API (limit 10)"
                    >
                      <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors cursor-pointer">
                        GET
                      </span>
                    </a>
                    <a
                      href={getRestApiDemoUrl(table.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="เปิดตัวอย่าง API (limit 10)"
                    >
                      <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors cursor-pointer">{table.path}</span>
                    </a>
                  </div>
                </div>
                <div className="bg-slate-700 p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <CodeIcon className="w-5 h-5" />
                    <span>Example Response</span>
                  </h3>
                  <pre className="text-xs text-slate-100 bg-slate-800 p-4 rounded-md overflow-x-auto">
                    <code>{`[
  {
    "column_1": "value",
    "column_2": "value",
    ...
  }
]`}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenDataPage;