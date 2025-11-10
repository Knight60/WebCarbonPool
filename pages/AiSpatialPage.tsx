import React, { useState, useEffect, useRef, DragEvent } from 'react';

// 1. Import OpenLayers
import 'ol/ol.css'; // Import OpenLayers CSS
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import { GripVertical } from 'lucide-react'; // (Optional: for drag handle icon)

// --- Layer Data ---
// ข้อมูลชั้นข้อมูล (Layers) ที่คุณให้มา
const geeLayersData: Record<string, string> = {
  "S2 Yearly Natural Color": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/eae2603d5c456ef7602b5a7f4c8e4fc2-6422288101c351ff0de1aebecacb950b/tiles/{z}/{x}/{y}",
  "S2 NDVI Monthly": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/f63f56cc4995333132eaa4a87f7b7b7b-70328d02c5285b7e396252c02fa6f918/tiles/{z}/{x}/{y}",
  "S1 Bands (Asset)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/9294a067ea586f65345ed09bcd903f0e-ef1b82a160421bd21b93b189f7399bb0/tiles/{z}/{x}/{y}",
  "SRTMGL1 RSEDTrans": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/7b5d79a905893ec6dedf3b010c454b9f-9d944be6749f89e5bbb006a727d03a0a/tiles/{z}/{x}/{y}",
  "Field Data 2025 (Styled)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/a13d346533bc3916bb4c7019e0489b3c-c7995220c0db1d6180d96150b13b5b4d/tiles/{z}/{x}/{y}",
  "Field Data 2023 (Styled)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/5fbe6fbbe80e59cdaf0eaa617c40b637-ff9d3eb67c344c4512e16b16c8214983/tiles/{z}/{x}/{y}",
  "Zero Areas Mask (Simplified)": "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/3decc07a2c928888c0425bee63634d96-423933254052ba9509077aa19dfdd6bc/tiles/{z}/{x}/{y}"
};

// --- Interfaces ---
// Interface สำหรับการจัดการสถานะของ Layer
interface LayerState {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  olLayer: TileLayer<XYZ>; // เก็บ OpenLayers layer instance
}

// --- Helper Function ---
// สร้าง OpenLayers TileLayer จากข้อมูล
const createGeeLayer = (id: string, label: string, url: string, visible: boolean, zIndex: number): LayerState => {
  const olLayer = new TileLayer({
    source: new XYZ({
      url: url,
      maxZoom: 20
    }),
    visible: visible,
    zIndex: zIndex,
  });
  // ใช้ 'id' property เพื่อเชื่อม React state กับ OL layer
  olLayer.set('id', id); 
  return { id, label, url, visible, olLayer };
};

// --- React Component ---
const AiSpatialPage: React.FC = () => {
  const mapTargetRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | undefined>();
  const [layers, setLayers] = useState<LayerState[]>([]);
  const draggedItemIndex = useRef<number | null>(null);

  // --- Map Initialization Effect ---
// --- Map Initialization Effect ---
  useEffect(() => {
    // 1. กำหนดลำดับและสถานะการแสดงผลเริ่มต้น (ตามรูปภาพ)
    const layerOrder = [
      "Field Data 2025 (Styled)",
      "Field Data 2023 (Styled)",
      "S2 NDVI Monthly",
      "S2 Yearly Natural Color",
      "S1 Bands (Asset)",
      "SRTMGL1 RSEDTrans",
      "Zero Areas Mask (Simplified)"
    ];

    // Layer ที่ต้องการให้เปิด (checked) เป็นค่าเริ่มต้น
    const defaultVisibleLayers = new Set([
      "Field Data 2025 (Styled)",
      "S2 Yearly Natural Color"
    ]);

    // 2. สร้าง Layer states จากลำดับที่กำหนด
    const initialLayers = layerOrder
      .map((label, index) => {
        const url = geeLayersData[label]; // ดึง URL จาก object เดิม
        
        // ตรวจสอบว่ามี URL ใน geeLayersData หรือไม่
        if (!url) {
          console.warn(`ไม่พบ URL สำหรับ Layer: ${label}`);
          return null; 
        }
        
        const id = label.replace(/\s+/g, '-').toLowerCase();
        const isVisible = defaultVisibleLayers.has(label);
        
        // zIndex: Layer ที่อยู่บนสุดใน UI (index 0) ต้องมี zIndex สูงสุด
        const zIndex = layerOrder.length - index; 
        
        return createGeeLayer(id, label, url, isVisible, zIndex);
      })
      .filter((layer): layer is LayerState => layer !== null); // กรองค่า null ออก

    setLayers(initialLayers);

    // 3. สร้างแผนที่ OpenLayers
    const olMap = new Map({
      controls: defaultControls().extend([new FullScreen()]), // เพิ่มปุ่ม Fullscreen
      view: new View({
        center: fromLonLat([100.5, 13.7]), // ศูนย์กลางประเทศไทย
        zoom: 6,
      }),
      layers: [
        // Base Layer (OpenStreetMap)
        new TileLayer({
          source: new OSM(),
          zIndex: 0, // อยู่ล่างสุดเสมอ
        }),
        // Add all GEE layers
        ...initialLayers.map(layer => layer.olLayer)
      ],
    });

    if (mapTargetRef.current) {
      olMap.setTarget(mapTargetRef.current);
    }
    setMap(olMap);

    // 4. Cleanup on unmount
    return () => {
      olMap.setTarget(undefined);
    };
  }, []); // Run once on component mount

  // --- Layer Control Handlers ---

  // 1. Toggle Layer Visibility
  const toggleLayerVisibility = (id: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer => {
        if (layer.id === id) {
          const newVisibility = !layer.visible;
          layer.olLayer.setVisible(newVisibility); // อัปเดต OL map ทันที
          return { ...layer, visible: newVisibility };
        }
        return layer;
      })
    );
  };

  // 2. Drag & Drop Handlers
  const handleDragStart = (index: number) => {
    draggedItemIndex.current = index;
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // อนุญาตให้ drop
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedItemIndex.current === null) return;

    const dragIndex = draggedItemIndex.current;
    if (dragIndex === dropIndex) return;

    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      // ย้าย Layer ใน Array
      const [draggedLayer] = newLayers.splice(dragIndex, 1);
      newLayers.splice(dropIndex, 0, draggedLayer);

      // อัปเดต zIndex ใน OpenLayers map
      // Layer ที่อยู่บนสุดใน UI (index 0) จะมี zIndex สูงสุด
      newLayers.forEach((layer, index) => {
        const zIndex = newLayers.length - index;
        layer.olLayer.setZIndex(zIndex);
      });

      return newLayers;
    });

    draggedItemIndex.current = null;
  };

  // --- Render JSX ---
  return (
    <div className="space-y-6 th-font">
      {/* 1. Page Header (คงไว้ตามเดิม) */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">AI Spatial Analysis</h1>
        <p className="mt-2 text-slate-600">
          แผนที่แสดงผลการวิเคราะห์เชิงพื้นที่และการประเมินการสะสมคาร์บอน
        </p>
      </div>

      {/* 2. Map Container */}
      <div className="bg-slate-200 rounded-xl shadow-sm overflow-hidden relative"
           style={{ height: 'calc(100vh - 20rem)' }} // ใช้ height เดิมเพื่อให้พอดีกับ Layout
      >
        {/* Map Target Div */}
        <div ref={mapTargetRef} className="w-full h-full" />

        {/* 3. Layer Control Overlay (ตามโจทย์) */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">ชั้นข้อมูล (Layers)</h2>
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
                {/* Drag Handle */}
                <span className="text-slate-400 mr-2" title="ลากเพื่อสลับลำดับ">
                  <GripVertical size={18} />
                </span>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => toggleLayerVisibility(layer.id)}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 mr-3"
                />
                
                {/* Label */}
                <span className="text-sm text-slate-700 select-none">
                  {layer.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSpatialPage;