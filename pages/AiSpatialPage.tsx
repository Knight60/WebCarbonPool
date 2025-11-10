import React, { useState, useEffect, useRef, DragEvent } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
// 1. อัปเดต imports
import { OSM, XYZ, TileWMS, Tile as TileSource } from 'ol/source'; 
import { fromLonLat, transformExtent } from 'ol/proj'; // Import เพิ่ม
import { Extent } from 'ol/extent'; // Import เพิ่ม
import { defaults as defaultControls } from 'ol/control';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Expand, 
  Shrink 
} from 'lucide-react';

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
}

// 2. Interface ใหม่สำหรับตัวเลือก Dropdown
interface LocationOption {
  value: string;
  label: string;
  bbox: Extent; // [xmin, ymin, xmax, ymax]
}

// --- Helper Function ---
const createOlLayer = (id: string, label: string, url: string, visible: boolean, zIndex: number): LayerState => {
  let source: TileSource;
  if (label === "AIGreen WMS") {
    source = new TileWMS({
      url: 'https://aigreen.dcce.go.th/geoserver/aigreen/wms',
      params: {
        'LAYERS': 'aigreen:AiGreenDLA,aigreen:Administration',
        'TILED': true,
        'TRANSPARENT': true,
        'FORMAT': 'image/png'
      },
      serverType: 'geoserver',
      transition: 0,
    });
  } else {
    source = new XYZ({ url: url, maxZoom: 20 });
  }
  const olLayer = new TileLayer({ source: source, visible: visible, zIndex: zIndex });
  olLayer.set('id', id); 
  return { id, label, url, visible, olLayer };
};

// --- React Component ---
const AiSpatialPage: React.FC = () => {
  // ... State เดิม ...
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapTargetRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | undefined>();
  const [layers, setLayers] = useState<LayerState[]>([]);
  const draggedItemIndex = useRef<number | null>(null);
  const [isLayerListVisible, setIsLayerListVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // --- 3. State ใหม่สำหรับ Dropdown ---
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [amphoes, setAmphoes] = useState<LocationOption[]>([]);
  const [tambons, setTambons] = useState<LocationOption[]>([]);
  
  const [selectedProv, setSelectedProv] = useState("all");
  const [selectedAmphoe, setSelectedAmphoe] = useState("all");
  const [selectedTambon, setSelectedTambon] = useState("all");

  // --- Effects (Map Init) ---
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
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

    const olMap = new Map({
      controls: defaultControls(), 
      view: new View({
        center: fromLonLat([100.5, 13.7]),
        zoom: 6,
      }),
      layers: [
        new TileLayer({ source: new OSM(), zIndex: 0 }),
        ...initialLayers.map(layer => layer.olLayer)
      ],
    });

    if (mapTargetRef.current) { olMap.setTarget(mapTargetRef.current); }
    setMap(olMap);

    return () => { olMap.setTarget(undefined); };
  }, []); 

  useEffect(() => {
    if (isIOS) return; 
    const handleFullscreenChange = () => { setIsFullscreen(!!document.fullscreenElement); };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => { document.removeEventListener('fullscreenchange', handleFullscreenChange); };
  }, [isIOS]);


  // --- 4. Logic ใหม่ (ดัดแปลงจาก index.js) ---

  // Helper: ฟังก์ชันสำหรับ fetch ข้อมูล Dropdown
  const fetchLocations = async (url: string, valueKey: string, textKey: string): Promise<LocationOption[]> => {
    try {
      const response = await fetch(url);
      const records = await response.json();
      return records.map((record: any): LocationOption => {
        // คำนวณ BBox (ตาม logic ใน index.js)
        const xmin = Math.min(...record.bbox.coordinates[0].map((xy: number[]) => xy[0]));
        const ymin = Math.min(...record.bbox.coordinates[0].map((xy: number[]) => xy[1]));
        const xmax = Math.max(...record.bbox.coordinates[0].map((xy: number[]) => xy[0]));
        const ymax = Math.max(...record.bbox.coordinates[0].map((xy: number[]) => xy[1]));
        
        return {
          value: record[valueKey],
          label: record[textKey],
          bbox: [xmin, ymin, xmax, ymax]
        };
      });
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      return [];
    }
  };
  
  // Helper: ฟังก์ชัน Zoom แผนที่ (ตาม logic ใน changeExtent)
  const zoomToExtent = (bbox: Extent) => {
    if (!map) return;
    // แปลง BBox จาก EPSG:4326 (ที่ API ให้มา) เป็น EPSG:3857 (ที่ Map ใช้)
    const mapExtent = transformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
    map.getView().fit(mapExtent, { duration: 1000, padding: [50, 50, 50, 50] });
  };
  
  // Effect: Fetch จังหวัด
  useEffect(() => {
    fetchLocations("https://aigreen.dcce.go.th/rest/BBoxProvince", 'prov_code', 'prov_namt')
      .then(setProvinces);
  }, []); // ทำงานครั้งเดียว

  // Effect: Fetch อำเภอ (เมื่อจังหวัดเปลี่ยน)
  useEffect(() => {
    if (selectedProv === "all") {
      setAmphoes([]);
      setSelectedAmphoe("all");
      return;
    }
    fetchLocations(`https://aigreen.dcce.go.th/rest/BBoxAmphoe?prov_code=like.${selectedProv}`, 'amp_code', 'amp_namt')
      .then(setAmphoes);
  }, [selectedProv]); // ทำงานเมื่อ selectedProv เปลี่ยน

  // Effect: Fetch ตำบล (เมื่ออำเภอเปลี่ยน)
  useEffect(() => {
    if (selectedAmphoe === "all") {
      setTambons([]);
      setSelectedTambon("all");
      return;
    }
    fetchLocations(`https://aigreen.dcce.go.th/rest/BBoxTambon?amp_code=like.${selectedAmphoe}`, 'tam_code', 'tam_namt')
      .then(setTambons);
  }, [selectedAmphoe]); // ทำงานเมื่อ selectedAmphoe เปลี่ยน

  // Handlers: สำหรับ Dropdown (ตาม logic ใน changeProvince, changeAmphoe, changeTambon)
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProv(value);
    setSelectedAmphoe("all"); // Reset
    setSelectedTambon("all"); // Reset
    
    const option = provinces.find(p => p.value === value);
    if (option) zoomToExtent(option.bbox);
  };
  
  const handleAmphoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAmphoe(value);
    setSelectedTambon("all"); // Reset

    const option = amphoes.find(a => a.value === value);
    if (option) zoomToExtent(option.bbox);
  };

  const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTambon(value);
    
    const option = tambons.find(t => t.value === value);
    if (option) zoomToExtent(option.bbox);
  };

  // --- Handlers เดิม ---
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

  // Fullscreen Handler
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

  // --- Render JSX ---
  return (
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
            ? "fixed inset-0 z-50 w-screen h-screen bg-slate-200" // Fake Fullscreen
            : "bg-slate-200 rounded-xl shadow-sm overflow-hidden relative" // Normal
        }
        style={
          isFullscreen && isIOS
            ? {}
            : { height: 'calc(100vh - 20rem)' }
        }
      >
        {/* Map Target Div */}
        <div ref={mapTargetRef} className="w-full h-full" />

        {/* 3. Layer Control Overlay (ตำแหน่งเดิม) */}
        <div className="absolute top-2 left-14 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30">
          
          <div 
            className="flex justify-between items-center cursor-pointer select-none"
            onClick={() => setIsLayerListVisible(prev => !prev)}
          >
            <h2 className="text-lg font-semibold text-slate-800">ชั้นข้อมูล (Layers)</h2>
            {isLayerListVisible ? 
              <ChevronUp size={20} className="text-slate-600" /> : 
              <ChevronDown size={20} className="text-slate-600" />
            }
          </div>
          {isLayerListVisible && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-3"> (ลากเพื่อสลับลำดับ)</p>
              <div className="space-y-2">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    draggable={true}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className="flex items-center p-2 rounded bg-white/50 hover:bg-slate-100 cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-slate-400 mr-2" title="ลากเพื่อสลับลำดับ"><GripVertical size={18} /></span>
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayerVisibility(layer.id)}
                      className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 mr-3"
                    />
                    <span className="text-sm text-slate-700 select-none">{layer.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. ปุ่ม Fullscreen (ตำแหน่งเดิม) */}
        <button
          onClick={toggleCustomFullscreen}
          className="absolute top-2 left-2 z-30 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "แสดงผลเต็มจอ"}
        >
          {isFullscreen ? <Shrink size={24} /> : <Expand size={24} />}
        </button>
        
        {/* 5. Dropdown ควบคุมพื้นที่ (ใหม่) */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30 th-font">
          <div className="space-y-3">
            {/* จังหวัด */}
            <div className="flex items-center">
              <label className="w-1/4 text-sm font-semibold text-slate-700">จังหวัด</label>
              <select 
                className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50"
                value={selectedProv}
                onChange={handleProvinceChange}
              >
                <option value="all">ทุกจังหวัด</option>
                {provinces.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* อำเภอ */}
            <div className="flex items-center">
              <label className="w-1/4 text-sm font-semibold text-slate-700">อำเภอ</label>
              <select 
                className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50"
                value={selectedAmphoe}
                onChange={handleAmphoeChange}
                disabled={selectedProv === 'all' || amphoes.length === 0}
              >
                <option value="all">ทุกอำเภอ</option>
                 {amphoes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* ตำบล */}
            <div className="flex items-center">
              <label className="w-1/4 text-sm font-semibold text-slate-700">ตำบล</label>
              <select 
                className="w-3/4 form-select form-select-sm rounded-md shadow-sm border-slate-300 focus:border-emerald-400 focus:ring focus:ring-emerald-300 focus:ring-opacity-50"
                value={selectedTambon}
                onChange={handleTambonChange}
                disabled={selectedAmphoe === 'all' || tambons.length === 0}
              >
                <option value="all">ทุกตำบล</option>
                 {tambons.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiSpatialPage;