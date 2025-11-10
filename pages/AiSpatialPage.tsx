import React, { useState, useEffect, useRef, DragEvent } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
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
  olLayer: TileLayer<XYZ>;
}

// --- Helper Function ---
const createGeeLayer = (id: string, label: string, url: string, visible: boolean, zIndex: number): LayerState => {
  const olLayer = new TileLayer({
    source: new XYZ({ url: url, maxZoom: 20 }),
    visible: visible,
    zIndex: zIndex,
  });
  olLayer.set('id', id); 
  return { id, label, url, visible, olLayer };
};

// --- React Component ---
const AiSpatialPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapTargetRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | undefined>();
  const [layers, setLayers] = useState<LayerState[]>([]);
  const draggedItemIndex = useRef<number | null>(null);
  const [isLayerListVisible, setIsLayerListVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // --- Effects ---
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const layerOrder = [
      "Field Data 2025 (Styled)",
      "Field Data 2023 (Styled)",
      "ESA AGBD 2022",
      "S2 NDVI Monthly",
      "S2 Yearly Natural Color",
      "S1 Bands (Asset)",
      "SRTMGL1 RSEDTrans",
      "Zero Areas Mask (Simplified)",
      "GMap Hybrid",
    ];
    const defaultVisibleLayers = new Set([
      "Field Data 2025 (Styled)",
      "ESA AGBD 2022",
      //"S2 Yearly Natural Color",
      "GMap Hybrid",
    ]);

    const initialLayers = layerOrder
      .map((label, index) => {
        const url = geeLayersData[label];
        if (!url) { console.warn(`ไม่พบ URL สำหรับ Layer: ${label}`); return null; }
        const id = label.replace(/\s+/g, '-').toLowerCase();
        const isVisible = defaultVisibleLayers.has(label);
        const zIndex = layerOrder.length - index; 
        return createGeeLayer(id, label, url, isVisible, zIndex);
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

    if (mapTargetRef.current) {
      olMap.setTarget(mapTargetRef.current);
    }
    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
    };
  }, []); 

  useEffect(() => {
    if (isIOS) return; 

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isIOS]);

  // --- Handlers ---
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

        {/* 3. Layer Control Overlay (❗️อัปเดตตำแหน่ง) */}
        <div className="absolute top-2 left-14 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30">
          {/* ^^^ เปลี่ยนเป็น top-2 left-14 (0.5rem top, 3.5rem left) ^^^ */}
          
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

        {/* 4. ปุ่ม Fullscreen (❗️อัปเดตตำแหน่ง) */}
        <button
          onClick={toggleCustomFullscreen}
          className="absolute top-2 left-2 z-30 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "แสดงผลเต็มจอ"}
        >
          {/* ^^^ เปลี่ยนเป็น top-2 left-2 (0.5rem top, 0.5rem left) ^^^ */}
          
          {isFullscreen ? <Shrink size={24} /> : <Expand size={24} />}
        </button>
        
      </div>
    </div>
  );
};

export default AiSpatialPage;