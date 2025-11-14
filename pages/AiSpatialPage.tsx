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

// --- Interfaces ---
interface LayerState {
  id: string;
  label: string;
  url: string; // เก็บ URL หลัก (สำหรับ WMS) หรือ URL template (สำหรับ XYZ)
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

// Interface สำหรับ Config WMS
interface WMSConnection {
  url: string;
  params: Record<string, any>;
}

// Interface สำหรับ Config Layer
interface LayerConfig {
  id: string;
  label: string;
  type: 'WMS' | 'XYZ';
  /**
   * - WMS: WMSConnection object
   * - XYZ: URL string template
   */
  connection: WMSConnection | string;
  visible: boolean; // ค่าเริ่มต้นการแสดงผล
  symbol: string | null; // Placeholder สำหรับสัญลักษณ์ (ยังไม่ได้ใช้งาน)
}


// --- ⭐️ Layer Configuration ⭐️ ---
// Array นี้จะกำหนด "ลำดับ" การแสดงผลใน Layer List (index 0 อยู่บนสุด)
// และค่า zIndex บนแผนที่ (index 0 จะมี zIndex สูงสุด)
const configLayers: LayerConfig[] = [
  {
    id: "aigreen-wms",
    label: "ขอบเขตการปกครอง",
    type: "WMS",
    connection: {
      url: 'https://aigreen.dcce.go.th/geoserver/aigreen/wms',
      params: { 'LAYERS': 'aigreen:AiGreenDLA,aigreen:Administration', 'TILED': true, 'TRANSPARENT': true, 'FORMAT': 'image/png' },
    },
    visible: true,
    symbol: null,
  },
  {
    id: "field-data-2025-styled",
    label: "ต้นไม้ในแปลงถาวรปี 2025",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/a13d346533bc3916bb4c7019e0489b3c-c7995220c0db1d6180d96150b13b5b4d/tiles/{z}/{x}/{y}",
    visible: true,
    symbol: null,
  },
  {
    id: "field-data-2023-styled",
    label: "ต้นไม้ในแปลงถาวรปี 2023",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/5fbe6fbbe80e59cdaf0eaa617c40b637-ff9d3eb67c344c4512e16b16c8214983/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  {
    id: "esa-agbd-2022",
    label: "ESA AGBD 2022",
    type: "XYZ",
    connection: "https://earthengine.googleapis.com/v1/projects/pisut-earthengine/maps/e32614cbeda6fd5d675f7203a5520e1b-1a6ae08bdee3f8f358006d84bf3a407b/tiles/{z}/{x}/{y}",
    visible: true,
    symbol: null,
  },
  // --- ⭐️ เพิ่มชั้นข้อมูลใหม่ตามคำขอ ⭐️ ---
  {
    id: "green-area-type",
    label: "ประเภทพื้นที่สีเขียว", // แก้ไขจาก "Geen"
    type: "WMS",
    connection: {
      url: 'https://aigreen.dcce.go.th/geoserver/aigreen/wms',
      params: { 
        'LAYERS': 'aigreen:AiGreenTypesTIF', // ดึงมาจาก URL
        'TILED': true, 
        'TRANSPARENT': true, 
        'FORMAT': 'image/png' 
      },
    },
    visible: false, // ตั้งค่าเริ่มต้นเป็น ไม่แสดง
    symbol: null,
  },
  // --- ⭐️ สิ้นสุดชั้นข้อมูลใหม่ ⭐️ ---
  {
    id: "s2-ndvi-monthly",
    label: "S2 NDVI เฉลี่ยรายเดือน ปี 2024",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/f63f56cc4995333132eaa4a87f7b7b7b-70328d02c5285b7e396252c02fa6f918/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  {
    id: "s2-yearly-natural-color",
    label: "S2 5Bands เฉลี่ยรายปี 2024",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/eae2603d5c456ef7602b5a7f4c8e4fc2-6422288101c351ff0de1aebecacb950b/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  {
    id: "s1-bands-(asset)",
    label: "S1 (VV,VH,VVdVH) เฉลี่ยรายปี 2024",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/9294a067ea586f65345ed09bcd903f0e-ef1b82a160421bd21b93b189f7399bb0/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  {
    id: "srtmgl1-rsedtrans",
    label: "ความสูงเชิงเลข SRTM GL1",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/7b5d79a905893ec6dedf3b010c454b9f-9d944be6749f89e5bbb006a727d03a0a/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  /*{
    id: "zero-areas-mask-(simplified)",
    label: "Zero Areas Mask (Simplified)",
    type: "XYZ",
    connection: "https://earthengine-highvolume.googleapis.com/v1/projects/envimodeling/maps/3decc07a2c928888c0425bee63634d96-423933254052ba9509077aa19dfdd6bc/tiles/{z}/{x}/{y}",
    visible: false,
    symbol: null,
  },
  {
    id: "gmap-hybrid",
    label: "GMap Hybrid",
    type: "XYZ",
    connection: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    visible: true,
    symbol: null,
  }*/
];

// Config สีและชื่อสำหรับ Chart
const seriesConfig: Record<string, { name: string, color: string }> = {
  'P': { name: 'สวนสาธารณะ', color: '#FF7F7F' },
  'MG': { name: 'สถานที่ราชการ', color: '#007086' },
  'MP': { name: 'สวนเอกชน', color: '#00FFC5' },
  'S': { name: 'แถบตามสาธารณูปโภค', color: '#C500FF' },
  'E': { name: 'เพื่อเศรษฐกิจ', color: '#FFFF00' },
  'NCO': { name: 'ธรรมชาติในเขตอนุรักษ์ (ทั่วไป)', color: '#38A800' },
  'NCM': { name: 'ธรรมชาติในเขตอนุรักษ์ (ป่าชายเลน)', color: '#1A6B00' },
  'NOO': { name: 'ธรรมชาตินอกเขตอนุรักษ์ (ทั่วไป)', color: '#98E600' },
  'NOM': { name: 'ธรรมชาตินอกเขตอนุรักษ์ (ป่าชายเลน)', color: '#98E600' },
  'W': { name: 'พื้นที่ทิ้งร้าง', color: '#FF5500' },
};
// Key ที่จะนำมา Stack
const summaryStackKeys = ['P', 'MG', 'MP', 'S', 'E', 'NCO', 'NCM', 'NOO', 'NOM', 'W'];

// --- Helper Function ---

/**
 * ⭐️ ปรับปรุง: สร้าง LayerState และ olLayer จาก LayerConfig
 */
const createOlLayer = (config: LayerConfig, zIndex: number): LayerState => {
  let source: TileSource;
  let urlString: string;

  if (config.type === "WMS" && typeof config.connection === 'object') {
    const wmsConfig = config.connection as WMSConnection;
    source = new TileWMS({
      url: wmsConfig.url,
      params: wmsConfig.params,
      serverType: 'geoserver',
      transition: 0,
    });
    urlString = wmsConfig.url;
  } else {
    // สมมติว่าเป็น XYZ
    urlString = config.connection as string;
    source = new XYZ({ url: urlString, maxZoom: 20 });
  }

  const olLayer = new TileLayer({ 
    source: source, 
    visible: config.visible, 
    zIndex: zIndex,
    opacity: 1 
  });
  
  olLayer.set('id', config.id); 
  
  return { 
    id: config.id, 
    label: config.label, 
    url: urlString, // เก็บ URL หลัก
    visible: config.visible, 
    olLayer, 
    opacity: 1 
  };
};

const formatNumber = (num: string | number | null | undefined) => {
  if (num === null || num === undefined) return '-';
  const val = parseFloat(String(num).replace(/,/g, ''));
  if (isNaN(val)) return '-';
  return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

// Helper Function สำหรับดึงค่าที่จะใช้ Sort
const getValueForSort = (record: SummaryRecord, key: string): string | number | null => {
  const val = record[key];
  if (val === null || val === undefined || val === '-') {
      return null; // ถือว่าค่า null, undefined, หรือ '-' ต่ำที่สุด
  }
  
  // ตรวจสอบว่าเป็นคอลัมน์ Metric (ตัวเลข) หรือไม่
  if (key.startsWith('arearai_') || key.startsWith('coabsorb_')) {
      const num = parseFloat(String(val).replace(/,/g, ''));
      return isNaN(num) ? null : num;
  }
  
  // ถ้าไม่ใช่ (เช่น รหัส, ชื่อ) ให้คืนค่าเป็น String
  return String(val);
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
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // ⭐️ FIX: ตั้งค่า Sort เริ่มต้น
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>({
    key: 'arearai_Total', // ค่าเริ่มต้น: ไร่ (arearai) และคอลัมน์ Total
    order: 'desc',        // ค่าเริ่มต้น: มากไปน้อย
  });

  // Handler (Chart)
  const toggleSeries = (key: string) => {
    setHiddenSeries(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Helper (Map Zoom)
  const zoomToExtent = (mapInstance: Map | undefined, bbox: Extent) => {
    if (!mapInstance) return; 
    const mapExtent = transformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
    mapInstance.getView().fit(mapExtent, { duration: 1000, padding: [50, 50, 50, 50] });
  };

  // --- Effects (Map Init) ---
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    // ⭐️ ปรับปรุง: โหลด Layer จาก configLayers
    const initialLayers = configLayers
      .map((config, index) => {
        // zIndex คำนวณจากลำดับใน Array (index 0 อยู่บนสุด = zIndex สูงสุด)
        const zIndex = configLayers.length - index; 
        return createOlLayer(config, zIndex);
      });
    setLayers(initialLayers);
    
    // ... (โค้ดสร้าง Map) ...
    const olMap = new Map({
      controls: defaultControls(), 
      view: new View({ center: fromLonLat([100.5, 13.7]), zoom: 6 }),
      layers: [
        new TileLayer({ source: new OSM(), zIndex: 0 }), // Base map
        ...initialLayers.map(layer => layer.olLayer) // Add layers from config
      ],
    });
    
    if (mapTargetRef.current) { olMap.setTarget(mapTargetRef.current); }
    setMap(olMap);
    
    // Zoom ไปประเทศไทยตอนเริ่มต้น
    zoomToExtent(olMap, THAILAND_BBOX);

    return () => { 
      olMap.setTarget(undefined);
      setMap(undefined);
    };
  }, []); // Dependencies ว่างเปล่า ถูกต้องแล้ว

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

  // ⭐️ FIX: Effect ใหม่ เพื่อซิงค์ SortKey กับ Metric
  useEffect(() => {
    setSortConfig(prevConfig => {
      if (!prevConfig) return prevConfig; // ถ้าไม่ได้ Sort อยู่ ก็ไม่ต้องทำอะไร

      // ถ้า key เดิมเป็น arearai, เปลี่ยนเป็น coabsorb (และกลับกัน)
      let newKey = prevConfig.key;
      if (summaryMetric === 'coabsorb' && prevConfig.key.startsWith('arearai_')) {
        newKey = prevConfig.key.replace('arearai_', 'coabsorb_');
      } else if (summaryMetric === 'arearai' && prevConfig.key.startsWith('coabsorb_')) {
        newKey = prevConfig.key.replace('coabsorb_', 'arearai_');
      }
      
      return { ...prevConfig, key: newKey };
    });
  }, [summaryMetric]); // ทำงานเมื่อ summaryMetric เปลี่ยน

  // --- Handlers ---
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProv(value);
    setSelectedAmphoe("all"); 
    setSelectedTambon("all");
    setSearchQuery(""); 
    
    // Reset Sort (เฉพาะเมื่อไม่ได้ Sort ตามค่า Metric)
    setSortConfig(prevConfig => {
      if (prevConfig && (prevConfig.key.startsWith('arearai_') || prevConfig.key.startsWith('coabsorb_'))) {
        return prevConfig;
      }
      return null;
    });

    if (!map) return;
    if (value === "all") {
      zoomToExtent(map, THAILAND_BBOX);
    } else {
      const option = provinces.find(p => p.value === value);
      if (option) zoomToExtent(map, option.bbox);
    }
  };
  
  const handleAmphoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAmphoe(value);
    setSelectedTambon("all");
    setSearchQuery(""); 
    
    // Reset Sort (เฉพาะเมื่อไม่ได้ Sort ตามค่า Metric)
    setSortConfig(prevConfig => {
      if (prevConfig && (prevConfig.key.startsWith('arearai_') || prevConfig.key.startsWith('coabsorb_'))) {
        return prevConfig;
      }
      return null;
    });

    if (!map) return;
    if (value === "all") {
      const parentProvOption = provinces.find(p => p.value === selectedProv);
      if (parentProvOption) {
        zoomToExtent(map, parentProvOption.bbox);
      } else {
        zoomToExtent(map, THAILAND_BBOX);
      }
    } else {
      const option = amphoes.find(a => a.value === value);
      if (option) zoomToExtent(map, option.bbox);
    }
  };

  const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTambon(value);
    setSearchQuery(""); 
    
    // Reset Sort (เฉพาะเมื่อไม่ได้ Sort ตามค่า Metric)
    setSortConfig(prevConfig => {
      if (prevConfig && (prevConfig.key.startsWith('arearai_') || prevConfig.key.startsWith('coabsorb_'))) {
        return prevConfig;
      }
      return null;
    });

    if (!map) return;
    if (value === "all") {
      const parentAmphoeOption = amphoes.find(a => a.value === selectedAmphoe);
      if (parentAmphoeOption) {
        zoomToExtent(map, parentAmphoeOption.bbox);
      } else {
        const parentProvOption = provinces.find(p => p.value === selectedProv);
        if (parentProvOption) {
          zoomToExtent(map, parentProvOption.bbox);
        }
      }
    } else {
      const option = tambons.find(t => t.value === value);
      if (option) zoomToExtent(map, option.bbox);
    }
  };
  
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
        // อัปเดต zIndex ตามลำดับใหม่
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

  // Handler (Sort)
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      let newOrder: 'asc' | 'desc' = 'desc'; // ค่าเริ่มต้นเมื่อคลิกคอลัมน์ใหม่
      
      if (prevConfig && prevConfig.key === key) {
        // ถ้าคอลัมน์เดิม, สลับ order
        newOrder = prevConfig.order === 'desc' ? 'asc' : 'desc';
      }
      
      return { key, order: newOrder };
    });
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

  // Logic คำนวณค่าสูงสุดสำหรับ Chart
  const maxValue = useMemo(() => {
    if (filteredSummaryData.length === 0) {
      return 1;
    }
    let currentMax = 1;
    filteredSummaryData.forEach(record => {
      summaryStackKeys.forEach(key => {
        // คำนวณเฉพาะ Series ที่ "ไม่ถูกซ่อน"
        if (!hiddenSeries.has(key)) {
          const rawValue = record[`${summaryMetric}_${key}`] || 0;
          const value = parseFloat(String(rawValue).replace(/,/g, ''));
          if (!isNaN(value) && value > currentMax) {
            currentMax = value;
          }
        }
      });
    });
    
    // ปรับปรุง: ถ้าค่า Max เป็น 0 (เช่น ซ่อนหมด) ให้คืนค่า 1 เพื่อป้องกันการหารด้วย 0
    return currentMax > 0 ? currentMax : 1;
  }, [filteredSummaryData, summaryMetric, hiddenSeries]); // เพิ่ม hiddenSeries

  // useMemo (Sort Data)
  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return filteredSummaryData; // คืนค่าที่กรองแล้ว ถ้าไม่มีการ sort
    }
    
    const dataToSort = [...filteredSummaryData];
    
    dataToSort.sort((a, b) => {
      const valA = getValueForSort(a, sortConfig.key);
      const valB = getValueForSort(b, sortConfig.key);

      // ตรรกะ: null จะอยู่ท้ายสุดเสมอ
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1; // a (null) ไปอยู่หลัง b
      if (valB === null) return -1; // b (null) ไปอยู่หลัง a

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortConfig.order === 'asc' ? comparison : -comparison;
    });

    return dataToSort;
  }, [filteredSummaryData, sortConfig]); // ทำงานเมื่อข้อมูลที่กรองแล้ว หรือ config การ sort เปลี่ยน
  
  
  // --- Render JSX ---
  
  // Component ย่อยสำหรับไอคอน Sort
  const SortIcon = ({ forkey }: { forkey: string }) => {
    if (!sortConfig || sortConfig.key !== forkey) {
      return <span className="text-slate-400 opacity-30">↕</span>;
    }
    if (sortConfig.order === 'asc') {
      return <span className="text-emerald-500">↑</span>;
    }
    return <span className="text-emerald-500">↓</span>;
  };

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
          {/* Map Target Div */}
          <div ref={mapTargetRef} className="w-full h-full" />

          {/* Controls บนแผนที่ */}
          
          {/* Layer Control Overlay */}
          <div className="absolute top-2 left-14 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm z-30">
            {/* ... (โค้ด Layer Control เหมือนเดิม) ... */}
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
          
          {/* Fullscreen Button */}
          <button onClick={toggleCustomFullscreen} className="absolute top-2 left-2 z-30 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400" title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "แสดงผลเต็มจอ"}>
            {isFullscreen ? <Shrink size={24} /> : <Expand size={24} />}
          </button>
                    
          {/* Opacity Editor Modal */}
          {opacityEditor && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-40 w-64">
              {/* ... (โค้ด Opacity Editor เหมือนเดิม) ... */}
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

          {/* Wrapper ใหม่สำหรับ Controls ด้านล่าง (Dropdown + Legend + Chart) */}
          <div className="absolute bottom-4 left-4 right-4 z-30 flex h-44 space-x-2 th-font">

            {/* Panel 1: Location Dropdowns */}
            <div className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg h-full overflow-y-auto">
              {/* ... (โค้ด Dropdown เหมือนเดิม) ... */}
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

            {/* Panel 2: Chart Legend */}
            <div className="flex-shrink-0 w-40 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg h-full overflow-y-auto space-y-1">
              {Object.entries(seriesConfig).map(([key, { name, color }]) => (
                <div
                  key={key}
                  onClick={() => toggleSeries(key)}
                  className={`flex items-center space-x-2 cursor-pointer p-0.5 rounded ${hiddenSeries.has(key) ? 'opacity-40 line-through' : ''}`}
                  title={`คลิกเพื่อซ่อน/แสดง ${name}`}
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }}></div>
                  <span className="text-xs text-slate-700 truncate">{name}</span>
                </div>
              ))}
            </div>

            {/* Panel 3: Chart Area */}
            <div className="flex-grow bg-white/80 backdrop-blur-sm rounded-lg shadow-lg h-full overflow-y-hidden overflow-x-auto px-2 py-2">
              {/* อัปเดต: ใช้ `sortedData` */}
              <div className="flex h-full gap-x-2" style={{ width: `${sortedData.length * 50 + (sortedData.length > 0 ? (sortedData.length - 1) * 8 : 0)}px` }}>
                {isSummaryLoading ? (
                  <div className="text-slate-500 text-sm p-2">กำลังโหลด...</div>
                ) : sortedData.length === 0 ? ( // อัปเดต
                   <div className="text-slate-500 text-sm p-2">ไม่พบข้อมูล</div>
                ) : (
                  // อัปเดต: ใช้ `sortedData`
                  sortedData.map(record => {
                    // คำนวณ Total ด้วยตนเอง (สำหรับ Title) โดยสนใจเฉพาะ Series ที่ "ไม่ถูกซ่อน"
                    const calculatedTotal = summaryStackKeys.reduce((sum, key) => {
                       if (hiddenSeries.has(key)) return sum;
                       const rawValue = record[`${summaryMetric}_${key}`] || 0;
                       return sum + parseFloat(String(rawValue).replace(/,/g, ''));
                    }, 0);
                    
                    const barTitle = `${record[nameKey]} (${record[codeKey]}) \nTotal (ที่แสดง): ${formatNumber(calculatedTotal)}`;
                    
                    return (
                      <div 
                        key={record[codeKey]} 
                        className="flex-shrink-0 w-12 h-full flex flex-col" 
                        title={barTitle}
                      >
                        {/* Bar (Stacked) */}
                        <div className="flex flex-col-reverse relative flex-grow mb-1">
                          {summaryStackKeys.map(key => {
                            const rawValue = record[`${summaryMetric}_${key}`] || 0;
                            const value = parseFloat(String(rawValue).replace(/,/g, ''));
                            // คำนวณความสูงเทียบกับ maxValue ที่คำนวณไว้
                            const heightPercent = maxValue === 0 ? 0 : (value / maxValue) * 100;
                            const segmentTitle = `${seriesConfig[key].name}: ${formatNumber(value)}`;
                            
                            return (
                              <div
                                key={key}
                                title={segmentTitle}
                                className="transition-all"
                                style={{
                                  height: hiddenSeries.has(key) ? 0 : `${heightPercent}%`, // ซ่อนถ้าถูกเลือก
                                  backgroundColor: seriesConfig[key].color,
                                }}
                              />
                            );
                          })}
                        </div>
                        {/* X-Axis Label */}
                        <div className="h-6 flex-shrink-0 text-xs text-slate-700 text-center truncate pt-1">
                          {record[nameKey]}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
          
        </div>
      </div>

      {/* 4. Dashboard (ตารางสรุป) */}
      <div className="p-4 bg-white rounded-xl shadow-sm th-font">
        {/* ... (Header ของ Dashboard) ... */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-xl font-bold text-slate-800">
            สรุปข้อมูลพื้นที่สีเขียว ( {summaryMetric === 'arearai' ? 'ไร่' : 'ตัน'} ) - ระดับ{levelName}
          </h2>
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
        ) : sortedData.length > 0 ? ( // อัปเดต
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              {/* อัปเดต: <thead> พร้อม onClick และ Icons */}
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort(codeKey)}>
                    <div className="flex items-center space-x-1">
                      <span>รหัส</span>
                      <SortIcon forkey={codeKey} />
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort(nameKey)}>
                    <div className="flex items-center space-x-1">
                      <span>{levelName}</span>
                      <SortIcon forkey={nameKey} />
                    </div>
                  </th>
                  {summaryStackKeys.map(col => {
                    const key = `${summaryMetric}_${col}`;
                    return (
                      <th key={col} className="px-4 py-2 text-right font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort(key)}>
                        <div className="flex items-center justify-end space-x-1">
                          <span>{col}</span>
                          <SortIcon forkey={key} />
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-4 py-2 text-right font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort(`${summaryMetric}_Total`)}>
                    <div className="flex items-center justify-end space-x-1">
                      <span>Total</span>
                      <SortIcon forkey={`${summaryMetric}_Total`} />
                    </div>
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort(`${summaryMetric}_Overall`)}>
                    <div className="flex items-center justify-end space-x-1">
<span>Overall</span>
                      <SortIcon forkey={`${summaryMetric}_Overall`} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {/* อัปเดต: ใช้ `sortedData` */}
                {sortedData.map(record => (
                  <tr key={record[codeKey]} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{record[codeKey]}</td>
                    <td className="px-4 py-2 text-slate-900 font-medium">{record[nameKey]}</td>
                    {summaryStackKeys.map(col => (
                      <td key={col} className="px-4 py-2 text-right text-slate-700">
                        {formatNumber(record[`${summaryMetric}_${col}`])}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right text-slate-800 font-medium">{formatNumber(record[`${summaryMetric}_Total`])}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-medium">{formatNumber(record[`${summaryMetric}_Overall`])}</td>
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