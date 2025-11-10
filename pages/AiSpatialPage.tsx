import React, { useState, useEffect, useRef, DragEvent, useMemo } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ, TileWMS, Tile as TileSource } from 'ol/source'; 
import { fromLonLat, transformExtent } from 'ol/proj';
import { Extent } from 'ol/extent';
import { defaults as defaultControls } from 'ol/control';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Expand, 
  Shrink,
  SlidersHorizontal,
  X,
  ArrowRightLeft
} from 'lucide-react';

// Bounding Box ของประเทศไทย (จาก index.js)
const THAILAND_BBOX: Extent = [96.692891, 5.122222, 106.192853, 21.402443];

// --- Layer Data ---
const geeLayersData: Record<string, string> = {
  "AIGreen WMS": "https://aigreen.dcce.go.th/geoserver/aigreen/wms",
  "S2 Yearly Natural Color": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/eae2603d5c456ef7602b5a7f4c8e4fc2-6422288101c351ff0de1aebecacb950b/tiles/{z}/{x}/{y}",
  "S2 NDVI Monthly": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/f63f56cc4995333132eaa4a87f7b7b7b-70328d02c5285b7e396252c02fa6f918/tiles/{z}/{x}/{y}",
  "S1 Bands (Asset)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/9294a067ea586f65345ed09bcd903f0e-ef1b82a160421bd21b93b189f7399bb0/tiles/{z}/{x}/{y}",
  "SRTMGL1 RSEDTrans": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/7b5d79a905893ec6dedf3b010c454b9f-9d944be6749f89e5bbb006a727d03a0a/tiles/{z}/{x}/{y}",
  "Field Data 2025 (Styled)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/a13d346533bc3916bb4c7019e0489b3c-c7995220c0db1d6180d96150b13b5b4d/tiles/{z}/{x}/{y}",
  "Field Data 2023 (Styled)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/5fbe6fbbe80e59cdaf0eaa617c40b637-ff9d3eb67c344c4512e16b16c8214983/tiles/{z}/{x}/{y}",
  "Zero Areas Mask (Simplified)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/3decc07a2c928888c0425bee63634d96-423933254052ba9509077aa19dfdd6bc/tiles/{z}/{x}/{y}",
  "ESA AGBD 2022": "https://earthengine.googleapis.com/v1/projects/pisut-earthengine/maps/e32614cbeda6fd5d675f7203a5520e1b-1a6ae08bdee3f8f358006d84bf3a407b/tiles/{z}/{x}/{y}",
  "GMap Hybrid":"https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
};

// --- Interfaces ---
interface LayerState {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  olLayer: TileLayer<TileSource>;
  opacity: number;
}
interface LocationOption {
  value: string;
  label: string;
  bbox: Extent;
}
type SummaryRecord = Record<string, any>;

// --- Helper Function ---
const createOlLayer = (id: string, label: string, url: string, visible: boolean, zIndex: number): LayerState => {
  let source: TileSource;
  if (label === "AIGreen WMS") {
    source = new TileWMS({
      url: 'https://aigreen.dcce.go.th/geoserver/aigreen/wms',
      params: { 'LAYERS': 'aigreen:AiGreenDLA,aigreen:Administration', 'TILED': true, 'TRANSPARENT': true, 'FORMAT': 'image/png' },
      serverType: 'geoserver',
      transition: 0,
    });
  } else {
    source = new XYZ({ url: url, maxZoom: 20 });
  }
  const olLayer = new TileLayer({ 
    source: source, 
    visible: visible, 
    zIndex: zIndex,
    opacity: 1 
  });
  olLayer.set('id', id); 
  return { id, label, url, visible, olLayer, opacity: 1 };
};

const formatNumber = (num: string | number | null | undefined) => {
  if (num === null || num === undefined) return '-';
  const val = parseFloat(String(num).replace(/,/g, ''));
  if (isNaN(val)) return '-';
  return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

// --- React Component ---
const AiSpatialPage: React.FC = () => {
  // States
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapTargetRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | undefined>();
  const [layers, setLayers] = useState<LayerState[]>([]);
  const draggedItemIndex = useRef<number | null>(null);
  const [isLayerListVisible, setIsLayerListVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [amphoes, setAmphoes] = useState<LocationOption[]>([]);
  const [tambons, setTambons] = useState<LocationOption[]>([]);
  const [selectedProv, setSelectedProv] = useState("all");
  const [selectedAmphoe, setSelectedAmphoe] = useState("all");
  const [selectedTambon, setSelectedTambon] = useState("all");
  const [opacityEditor, setOpacityEditor] = useState<{ id: string; label: string } | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryRecord[]>([]);
  const [summaryLevel, setSummaryLevel] = useState<'province' | 'amphoe' | 'tambon'>('province');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryMetric, setSummaryMetric] = useState<'arearai' | 'coabsorb'>('arearai');
  const [searchQuery, setSearchQuery] = useState("");

  // --- Effects (Map Init) ---
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    // ... (โค้ดโหลด Layer) ...
    const layerOrder = [
      "AIGreen WMS", "Field Data 2025 (Styled)", "Field Data 2023 (Styled)", "ESA AGBD 2022",
      "S2 NDVI Monthly", "S2 Yearly Natural Color", "S1 Bands (Asset)", "SRTMGL1 RSEDTrans",
      "Zero Areas Mask (Simplified)", "GMap Hybrid",
    ];
    const defaultVisibleLayers = new Set([
      "AIGreen WMS", "Field Data 2025 (Styled)", "ESA AGBD 2022", "GMap Hybrid",
    ]);
    const initialLayers = layerOrder
      .map((label, index) => {
        const url = geeLayersData[label];
        if (!url) { console.warn(`ไม่พบ URL สำหรับ Layer: ${label}`); return null; }
        const id = label.replace(/\s+/g, '-').toLowerCase();
        const isVisible = defaultVisibleLayers.has(label);
        const zIndex = layerOrder.length - index; 
        return createOlLayer(id, label, url, isVisible, zIndex);
      })
      .filter((layer): layer is LayerState => layer !== null);
    setLayers(initialLayers);
    // ... (โค้ดสร้าง Map) ...
    const olMap = new Map({
      controls: defaultControls(), 
      view: new View({ center: fromLonLat([100.5, 13.7]), zoom: 6 }),
      layers: [
        new TileLayer({ source: new OSM(), zIndex: 0 }),
        ...initialLayers.map(layer => layer.olLayer)
      ],
    });
    if (mapTargetRef.current) { olMap.setTarget(mapTargetRef.current); }
    setMap(olMap);
    
    // Zoom ไปประเทศไทยตอนเริ่มต้น
    zoomToExtent(THAILAND_BBOX);

    return () => { olMap.setTarget(undefined); };
  }, []); // <-- dependency array ว่าง ถูกต้องแล้ว

  useEffect(() => {
    if (isIOS) return; 
    const handleFullscreenChange = () => { setIsFullscreen(!!document.fullscreenElement); };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => { document.removeEventListener('fullscreenchange', handleFullscreenChange); };
  }, [isIOS]);

  // --- Logic (Dropdown) ---
  const fetchLocations = async (url: string, valueKey: string, textKey: string): Promise<LocationOption[]> => {
    try {
      const response = await fetch(url);
      const records = await response.json();
      return records.map((record: any): LocationOption => {
        const xmin = Math.min(...record.bbox.coordinates[0].map((xy: number[]) => xy[0]));
        const ymin = Math.min(...record.bbox.coordinates[0].map((xy: number[]) => xy[1]));
        const xmax = Math.max(...record.bbox.coordinates[0].map((xy: number[]) => xy[0]));
        const ymax = Math.max(...record.bbox.coordinates[0].map((xy: number[]) => xy[1]));
        return { value: record[valueKey], label: record[textKey], bbox: [xmin, ymin, xmax, ymax] };
      });
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      return [];
    }
  };
  
  // *** แก้ไขฟังก์ชัน zoomToExtent ให้ใช้ .getView() จาก state ***
  const zoomToExtent = (bbox: Extent) => {
    // ใช้ map state แทนการส่ง map instance มา
    if (!map) return; 
    const mapExtent = transformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
    map.getView().fit(mapExtent, { duration: 1000, padding: [50, 50, 50, 50] });
  };
  
  useEffect(() => {
    fetchLocations("https://aigreen.dcce.go.th/rest/BBoxProvince", 'prov_code', 'prov_namt')
      .then(setProvinces);
  }, []);
  
  useEffect(() => {
    if (selectedProv === "all") { setAmphoes([]); setSelectedAmphoe("all"); return; }
    fetchLocations(`https://aigreen.dcce.go.th/rest/BBoxAmphoe?prov_code=like.${selectedProv}`, 'amp_code', 'amp_namt')
      .then(setAmphoes);
  }, [selectedProv]);
  
  useEffect(() => {
    if (selectedAmphoe === "all") { setTambons([]); setSelectedTambon("all"); return; }
    fetchLocations(`https://aigreen.dcce.go.th/rest/BBoxTambon?amp_code=like.${selectedAmphoe}`, 'tam_code', 'tam_namt')
      .then(setTambons);
  }, [selectedAmphoe]);

  // Effect (Fetch Dashboard Data)
  useEffect(() => {
    let url = '';
    let level: 'province' | 'amphoe' | 'tambon' = 'province';
    if (selectedAmphoe !== 'all') {
      url = `https://aigreen.dcce.go.th/rest/AiGreenCluster_PivotTAM?order=tam_code&amp_code=like.${selectedAmphoe}`;
      level = 'tambon';
    } else if (selectedProv !== 'all') {
      url = `https://aigreen.dcce.go.th/rest/AiGreenCluster_PivotAMP?order=amp_code&prov_code=like.${selectedProv}`;
      level = 'amphoe';
    } else {
      url = 'https://aigreen.dcce.go.th/rest/AiGreenCluster_PivotPRV?order=prov_code';
      level = 'province';
    }
    setSummaryLevel(level);
    setIsSummaryLoading(true);
    fetch(url)
      .then(response => response.json())
      .then((data: SummaryRecord[]) => {
        const codeKey = level === 'province' ? 'prov_code' : (level === 'amphoe' ? 'amp_code' : 'tam_code');
        setSummaryData(data.filter(record => record[codeKey] && record[codeKey] !== ' '));
      })
      .catch(error => {
        console.error("Failed to fetch summary data:", error);
        setSummaryData([]);
      })
      .finally(() => {
        setIsSummaryLoading(false);
      });
  }, [selectedProv, selectedAmphoe]);

  // --- Handlers ---
  
  // *** นี่คือ 3 Handlers ที่อัปเดตแล้ว ***
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProv(value);
    setSelectedAmphoe("all"); 
    setSelectedTambon("all");
    setSearchQuery(""); // Reset การค้นหา

    if (value === "all") {
      // 1. ถ้าเลือก "ทุกจังหวัด" ให้ซูมไปประเทศไทย
      zoomToExtent(THAILAND_BBOX);
    } else {
      // Logic เดิม: ซูมไปจังหวัดที่เลือก
      const option = provinces.find(p => p.value === value);
      if (option) zoomToExtent(option.bbox);
    }
  };
  
  const handleAmphoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAmphoe(value);
    setSelectedTambon("all");
    setSearchQuery(""); // Reset การค้นหา

    if (value === "all") {
      // 2. ถ้าเลือก "ทุกอำเภอ" ให้ซูมไปจังหวัดแม่
      const parentProvOption = provinces.find(p => p.value === selectedProv);
      if (parentProvOption) {
        zoomToExtent(parentProvOption.bbox);
      } else {
        // กรณีฉุกเฉิน (ไม่ควรเกิด)
        zoomToExtent(THAILAND_BBOX);
      }
    } else {
      // Logic เดิม: ซูมไปอำเภอที่เลือก
      const option = amphoes.find(a => a.value === value);
      if (option) zoomToExtent(option.bbox);
    }
  };

  const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTambon(value);
    setSearchQuery(""); // Reset การค้นหา

    if (value === "all") {
      // 3. ถ้าเลือก "ทุกตำบล" ให้ซูมไปอำเภอแม่
      const parentAmphoeOption = amphoes.find(a => a.value === selectedAmphoe);
      if (parentAmphoeOption) {
        zoomToExtent(parentAmphoeOption.bbox);
      } else {
        // กรณีฉุกเฉิน (ถ้าไม่เจออำเภอ ให้ซูมไปจังหวัด)
        const parentProvOption = provinces.find(p => p.value === selectedProv);
        if (parentProvOption) {
          zoomToExtent(parentProvOption.bbox);
        }
      }
    } else {
      // Logic เดิม: ซูมไปตำบลที่เลือก
      const option = tambons.find(t => t.value === value);
      if (option) zoomToExtent(option.bbox);
    }
  };
  
  // ... (Handlers อื่นๆ เหมือนเดิม) ...
  const toggleLayerVisibility = (id: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer => {
        if (layer.id === id) {
          const newVisibility = !layer.visible;
          layer.olLayer.setVisible(newVisibility);
          return { ...layer, visible: newVisibility };
        }
        return layer;
      })
    );
  };
  const handleDragStart = (index: number) => { draggedItemIndex.current = index; };
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); };
  const handleDrop = (dropIndex: number) => {
    if (draggedItemIndex.current === null) return;
    const dragIndex = draggedItemIndex.current;
    if (dragIndex === dropIndex) return;
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const [draggedLayer] = newLayers.splice(dragIndex, 1);
      newLayers.splice(dropIndex, 0, draggedLayer);
      newLayers.forEach((layer, index) => {
        const zIndex = newLayers.length - index;
        layer.olLayer.setZIndex(zIndex);
      });
      return newLayers;
    });
    draggedItemIndex.current = null;
  };
  const toggleCustomFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (isIOS) {
      setIsFullscreen(prev => !prev);
      setTimeout(() => { map?.updateSize(); }, 150);
    } else {
      if (!document.fullscreenElement) {
        mapContainerRef.current.requestFullscreen().catch(err => console.error(err));
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }
  };
  const handleOpacityChange = (id: string, newOpacity: number) => {
    setLayers(prevLayers =>
      prevLayers.map(layer => {
        if (layer.id === id) {
          layer.olLayer.setOpacity(newOpacity);
          return { ...layer, opacity: newOpacity };
        }
        return layer;
      })
    );
  };

  // Helper (Dashboard)
  const { codeKey, nameKey, levelName } = useMemo(() => {
    if (summaryLevel === 'tambon') {
      return { codeKey: 'tam_code', nameKey: 'tam_namt', levelName: 'ตำบล' };
    }
    if (summaryLevel === 'amphoe') {
      return { codeKey: 'amp_code', nameKey: 'amp_namt', levelName: 'อำเภอ' };
    }
    return { codeKey: 'prov_code', nameKey: 'prov_namt', levelName: 'จังหวัด' };
  }, [summaryLevel]);

  const summaryCols = ['P', 'MG', 'MP', 'S', 'E', 'NCO', 'NCM', 'NOO', 'NOM', 'W', 'Total', 'Overall'];
  
  const filteredSummaryData = useMemo(() => {
    if (!searchQuery) {
      return summaryData; 
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return summaryData.filter(record => {
      const code = String(record[codeKey] || '').toLowerCase();
      const name = String(record[nameKey] || '').toLowerCase();
      return code.includes(lowerCaseQuery) || name.includes(lowerCaseQuery);
    });
  }, [summaryData, searchQuery, codeKey, nameKey]);
  
  // --- Render JSX ---
  return (
    <> 
      <div className="space-y-6 th-font">
        {/* 1. Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">AI Spatial Analysis</h1>
          <p className="mt-2 text-slate-600">
            แผนที่แสดงผลการวิเคราะห์เชิงพื้นที่และการประเมินการสะสมคาร์บอน
          </p>
        </div>

        {/* 2. Map Container */}
        <div 
          ref={mapContainerRef} 
          className={
            isFullscreen && isIOS
              ? "fixed inset-0 z-50 w-screen h-screen bg-slate-200"
              : "bg-slate-200 rounded-xl shadow-sm overflow-hidden relative"
          }
          style={
            isFullscreen && isIOS
              ? {}
              : { height: 'calc(100vh - 20rem)' }
          }
        >
          {/* ... (Controls ทั้งหมดบนแผนที่ เหมือนเดิม) ... */}
          <div ref={mapTargetRef} className="w-full h-full" />
          <div className="absolute top-2 left-14 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsLayerListVisible(prev => !prev)}>
              <h2 className="text-lg font-semibold text-slate-800">ชั้นข้อมูล (Layers)</h2>
              {isLayerListVisible ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
            </div>
            {isLayerListVisible && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-3"> (ลากเพื่อสลับลำดับ)</p>
                <div className="space-y-2">
                  {layers.map((layer, index) => (
                    <div key={layer.id} draggable={true} onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)} className="flex items-center p-2 rounded bg-white/50 hover:bg-slate-100 cursor-grab active:cursor-grabbing">
                      <span className="text-slate-400 mr-2" title="ลากเพื่อสลับลำดับ"><GripVertical size={18} /></span>
                      <input type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(layer.id)} className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 mr-3"/>
                      <span className="text-sm text-slate-700 select-none flex-grow">{layer.label}</span>
                      <button onClick={(e) => { e.stopPropagation(); setOpacityEditor({ id: layer.id, label: layer.label }); }} className="ml-2 text-slate-500 hover:text-slate-800 px-1" title="ปรับความโปร่งใส">
                        <SlidersHorizontal size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={toggleCustomFullscreen} className="absolute top-2 left-2 z-30 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400" title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "แสดงผลเต็มจอ"}>
            {isFullscreen ? <Shrink size={24} /> : <Expand size={24} />}
          </button>
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30 th-font">
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-1/4 text-sm font-semibold text-slate-700">จังหวัด</label>
                <select className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50" value={selectedProv} onChange={handleProvinceChange}>
                  <option value="all">ทุกจังหวัด</option>
                  {provinces.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-sm font-semibold text-slate-700">อำเภอ</label>
                <select className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50" value={selectedAmphoe} onChange={handleAmphoeChange} disabled={selectedProv === 'all' || amphoes.length === 0}>
                  <option value="all">ทุกอำเภอ</option>
                  {amphoes.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-sm font-semibold text-slate-700">ตำบล</label>
                <select className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50" value={selectedTambon} onChange={handleTambonChange} disabled={selectedAmphoe === 'all' || tambons.length === 0}>
                  <option value="all">ทุกตำบล</option>
                  {tambons.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          {opacityEditor && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-40 w-64">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-700 truncate pr-2" title={opacityEditor.label}>{opacityEditor.label}</h3>
                <button onClick={() => setOpacityEditor(null)} className="text-slate-500 hover:text-slate-800"><X size={18} /></button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">0%</span>
                <input type="range" min="0" max="1" step="0.05" value={layers.find(l => l.id === opacityEditor.id)?.opacity || 1} onChange={(e) => handleOpacityChange(opacityEditor.id, parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm"/>
                <span className="text-sm text-slate-600">100%</span>
              </div>
              <div className="text-center text-sm text-slate-700 mt-2">{Math.round((layers.find(l => l.id === opacityEditor.id)?.opacity || 1) * 100)}%</div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Dashboard (อัปเดต JSX) */}
      <div className="p-4 bg-white rounded-xl shadow-sm th-font">
        {/* Header ของ Dashboard (เพิ่มกล่องค้นหา) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-xl font-bold text-slate-800">
            สรุปข้อมูลพื้นที่สีเขียว ( {summaryMetric === 'arearai' ? 'ไร่' : 'ตัน'} ) - ระดับ{levelName}
          </h2>
          {/* กล่องเครื่องมือ (ค้นหา + สลับหน่วย) */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="ค้นหา (รหัส, ชื่อ)..."
              className="form-input px-3 py-2 text-sm border-slate-300 rounded-lg shadow-sm focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setSummaryMetric(m => m === 'arearai' ? 'coabsorb' : 'arearai')}
              className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <ArrowRightLeft size={16} />
              <span className="hidden md:inline">
                สลับเป็น {summaryMetric === 'arearai' ? 'คาร์บอน (ตัน)' : 'พื้นที่ (ไร่)'}
              </span>
            </button>
          </div>
        </div>
        
        {isSummaryLoading ? (
          <div className="text-center text-slate-500">กำลังโหลดข้อมูลสรุป...</div>
        ) : filteredSummaryData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">รหัส</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">{levelName}</th>
                  {summaryCols.map(col => (
                    <th key={col} className="px-4 py-2 text-right font-semibold text-slate-600">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredSummaryData.map(record => (
                  <tr key={record[codeKey]} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{record[codeKey]}</td>
                    <td className="px-4 py-2 text-slate-900 font-medium">{record[nameKey]}</td>
                    {summaryCols.map(col => (
                      <td key={col} className="px-4 py-2 text-right text-slate-700">
                        {formatNumber(record[`${summaryMetric}_${col}`])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            {searchQuery ? 'ไม่พบข้อมูลที่ตรงกับการค้นหา' : 'ไม่พบข้อมูลสรุป'}
          </div>
        )}
      </div>
    </>
  );
};

export default AiSpatialPage;