import React, { useState, useRef } from 'react';
import { UploadIcon, CameraIcon } from '../components/icons';

// --- Interface สำหรับ Response ---
interface TaxonomyResponse {
  filename?: string;
  token: string;
  source?: string;
  predicted?: any[];
  overall?: any[];
  count?: number;
  error?: string;
  details?: string;
}

interface HistoryItem {
  id: string;
  timestamp: Date;
  imageUrl: string;
  result: TaxonomyResponse;
}

// --- Supported Species Data ---
const supportedSpecies = [
  { common: "แสมขาว", scientific: "Avicennia alba Blume", page: 2 },
  { common: "อโศกอินเดีย", scientific: "Monoon longifolium (Sonn.) B.Xue & R.M.K.Saunders", page: 4 },
  { common: "ลำดวน", scientific: "Sphaerocoryne lefevrei (Baill.) D.M.Johnson & N.A.Murray", page: 6 },
  { common: "สัตตบรรณ", scientific: "Alstonia scholaris (L.) R.Br.", page: 8 },
  { common: "ตีนเป็ดทะเล", scientific: "Cerbera odollam Gaertn.", page: 10 },
  { common: "โมกมัน", scientific: "Wrightia arborea (Dennst.) Mabb.", page: 12 },
  { common: "แคนา", scientific: "Dolichandrone serrulata (Wall. ex DC.) Seem.", page: 14 },
  { common: "ปีบ", scientific: "Millingtonia hortensis L.f.", page: 16 },
  { common: "ชมพูพันธุ์ทิพย์", scientific: "Tabebuia rosea (Bertol.) DC.", page: 20 },
  { common: "กระทิง", scientific: "Calophyllum inophyllum L.", page: 24 },
  { common: "สารภี", scientific: "Mammea siamensis (Miq.) T.Anderson", page: 22 },
  { common: "สนทะเล", scientific: "Casuarina equisetifolia L.", page: 26 },
  { common: "สมอพิเภก", scientific: "Terminalia bellirica (Gaertn.) Roxb.", page: 30 },
  { common: "หูกวาง", scientific: "Terminalia catappa L.", page: 28 },
  { common: "หูกระจง", scientific: "Terminalia ivorensis A.Chev.", page: 32 },
  { common: "พะยอม", scientific: "Anthoshorea roxburghii (G.Don) P.S.Ashton & J.Heck.", page: 40 },
  { common: "ยางนา", scientific: "Dipterocarpus alatus Roxb. ex G.Don", page: 34 },
  { common: "ตะเคียนทอง", scientific: "Hopea odorata Roxb.", page: 36 },
  { common: "รัง", scientific: "Pentacme siamensis (Miq.) Kurz", page: 42 },
  { common: "เต็ง", scientific: "Shorea obtusa Wall. ex Blume", page: 38 },
  { common: "ยางพารา", scientific: "Hevea brasiliensis (Willd. ex A.Juss.) Müll.Arg.", page: 44 },
  { common: "กระถินณรงค์", scientific: "Acacia auriculiformis A.Cunn. ex Benth.", page: 46 },
  { common: "กระถินเทพา", scientific: "Acacia mangium Willd.", page: 48 },
  { common: "มะค่าโมง", scientific: "Afzelia xylocarpa (Kurz) Craib", page: 50 },
  { common: "พฤกษ์", scientific: "Albizia lebbeck (L.) Benth.", page: 52 },
  { common: "ทองกวาว", scientific: "Butea monosperma (Lam.) Kuntze", page: 54 },
  { common: "กัลปพฤกษ์", scientific: "Cassia bakeriana Craib", page: 56 },
  { common: "คูน", scientific: "Cassia fistula L.", page: 58 },
  { common: "พะยูง", scientific: "Dalbergia cochinchinensis Pierre", page: 60 },
  { common: "ฉนวน", scientific: "Dalbergia nigrescens Kurz" },
  { common: "หางนกยูงฝรั่ง", scientific: "Delonix regia (Bojer ex Hook.) Raf.", page: 64 },
  { common: "เขลง", scientific: "Dialium cochinchinense Pierre", page: 66 },
  { common: "อะราง", scientific: "Peltophorum dasyrhachis (Miq.) Kurz", page: 68 },
  { common: "นนทรี", scientific: "Peltophorum pterocarpum (DC.) Backer ex K.Heyne", page: 70 },
  { common: "ประดู่บ้าน", scientific: "Pterocarpus indicus Willd.", page: 72 },
  { common: "ประดู่ป่า", scientific: "Pterocarpus macrocarpus Kurz", page: 74 },
  { common: "จามจุรี", scientific: "Samanea saman (Jacq.) Merr.", page: 76 },
  { common: "ขี้เหล็ก", scientific: "Senna siamea (Lam.) H.S.Irwin & Barneby", page: 78 },
  { common: "มะค่าแต้", scientific: "Sindora siamensis Teijsm. ex Miq.", page: 80 },
  { common: "มะขาม", scientific: "Tamarindus indica L.", page: 82 },
  { common: "แดง", scientific: "Xylia xylocarpa var. kerrii (Craib & Hutch.) I.C.Nielsen", page: 84 },
  { common: "สัก", scientific: "Tectona grandis L.f.", page: 86 },
  { common: "จิกน้ำ", scientific: "Barringtonia acutangula (L.) Gaertn.", page: 88 },
  { common: "กระโดน", scientific: "Careya arborea Roxb.", page: 90 },
  { common: "ตะแบกนา", scientific: "Lagerstroemia floribunda Jack", page: 92 },
  { common: "อินทรชิต", scientific: "Lagerstroemia loudonii Teijsm. & Binn.", page: 94 },
  { common: "อินทนิลน้ำ", scientific: "Lagerstroemia speciosa (L.) Pers.", page: 96 },
  { common: "จำปี", scientific: "Magnolia × alba (DC.) Figlar", page: 98 },
  { common: "สะเดา", scientific: "Azadirachta indica A.Juss.", page: 100 },
  { common: "มะฮอกกานีใบใหญ่", scientific: "Swietenia macrophylla King", page: 102 },
  { common: "ขนุน", scientific: "Artocarpus heterophyllus Lam.", page: 104 },
  { common: "ไทรย้อยใบแหลม", scientific: "Ficus benjamina L.", page: 106 },
  { common: "โพศรีมหาโพ", scientific: "Ficus religiosa L.", page: 108 },
  { common: "โพขี้นก", scientific: "Ficus rumphii Blume", page: 110 },
  { common: "ข่อย", scientific: "Streblus asper Lour.", page: 112 },
  { common: "หว้า", scientific: "Syzygium cumini (L.) Skeels", page: 114 },
  { common: "โกงกางใบเล็ก", scientific: "Rhizophora apiculata Blume", page: 118 },
  { common: "โกงกางใบใหญ่", scientific: "Rhizophora mucronata Poir.", page: 116 },
  { common: "คำมอกหลวง", scientific: "Gardenia sootepensis Hutch.", page: 120 },
  { common: "พิกุล", scientific: "Mimusops elengi L.", page: 122 },
];

// --- Helper Functions ---
const getThaiName = (sciName: string) => {
  if (!sciName) return "";
  const found = supportedSpecies.find(s => s.scientific.toLowerCase() === sciName.toLowerCase());
  const name = found ? found.common : sciName;
  return name.replace(/^\(\d+\)\s*/, '');
};

const normalizeResult = (item: any[]) => {
  let score = "0";
  let sciName = "Unknown";
  let thaiName = "ไม่ระบุ";

  if (!item || item.length < 2) return { score, sciName, thaiName };

  if (!isNaN(parseFloat(item[0])) && parseFloat(item[0]) <= 1.0) {
    score = item[0];
    sciName = item[1];
    thaiName = item[2] || getThaiName(sciName);
  }
  else {
    sciName = item[0];
    score = item[1];
    thaiName = getThaiName(sciName);
  }

  return { score, sciName, thaiName };
};

const convertFileToJpg = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/jpeg') {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const jpgFile = new File([blob], newFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(jpgFile);
          },
          'image/jpeg',
          0.95
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};


const AiTaxonomyPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string>('new');
  const [apiResult, setApiResult] = useState<TaxonomyResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Modal State ---
  const [selectedSpecies, setSelectedSpecies] = useState<{ common: string; scientific: string; page?: number } | null>(null);

  const handleFileSelect = async (file: File | null | undefined) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('ไฟล์นามสกุลไม่รองรับ กรุณาใช้ JPG, JPEG, PNG, หรือ WEBP');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const jpgFile = await convertFileToJpg(file);
      setImage(jpgFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(jpgFile);
    } catch (err) {
      console.error("File processing error:", err);
      setError('เกิดข้อผิดพลาดในการประมวลผลไฟล์ภาพ');
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setImage(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetSession = () => {
    setToken('new');
    setApiResult(null);
    setHistory([]);
    handleRemoveFile();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSubmittedFile = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async () => {
    if (!image) {
      setError('กรุณาเลือกรูปภาพก่อน');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'bark');

    try {
      // ❗️❗️ ตรวจสอบ Hostname เพื่อเลือก URL
      const hostname = window.location.hostname;
      const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');

      const url = isLocalDev
        ? `http://localhost:8888/ai/taxonomy/${token}`
        : `/ai/taxonomy/${token}`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data: TaxonomyResponse = await response.json();

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (data.token) {
        setToken(data.token);
      }

      if (data.error) {
        setError(data.error);
      } else {
        setApiResult(data);

        if (previewUrl) {
          const newItem: HistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date(),
            imageUrl: previewUrl,
            result: data
          };
          setHistory(prev => [newItem, ...prev]);
        }

        clearSubmittedFile();
      }

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`การเชื่อมต่อขัดข้อง: ${err.message}`);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Modal Handlers ---
  const handleSpeciesClick = (species: { common: string; scientific: string; page?: number }) => {
    if (species.page) {
      setSelectedSpecies(species);
    } else {
      // Optional: Show a toast or alert if no page is available
      // alert(`ยังไม่มีข้อมูล PDF สำหรับ ${species.common}`);
    }
  };

  const closeSpeciesModal = () => {
    setSelectedSpecies(null);
  };

  return (
    <div className="space-y-6 th-font max-w-5xl mx-auto">
      <div className="text-center relative pt-4">
        <h1 className="text-3xl font-bold text-slate-800">AI Taxonomy - ระบบจำแนกพันธุ์ไม้</h1>
        <p className="mt-2 text-slate-600">
          อัปโหลดภาพ (เปลือกไม้/ใบไม้) เพื่อระบุชนิดพันธุ์ด้วย Gemini AI
        </p>
        <div className="absolute top-0 right-0 text-xs text-slate-400 hidden md:block bg-slate-100 px-2 py-1 rounded">
          Session: {token === 'new' ? 'New' : token.substring(0, 19).replace('T', ' ')}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* --- LEFT COLUMN: INPUT --- */}
          <div className="space-y-4">
            {!previewUrl && (
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                onClick={triggerFileInput}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files?.[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">ลากและวางไฟล์ที่นี่ หรือคลิกเพื่ออัปโหลด</p>
                <p className="text-xs text-slate-500">รองรับ: JPG, JPEG, PNG, WEBP</p>
              </div>
            )}

            {previewUrl && (
              <div className="mt-4 space-y-3">
                <h3 className="font-semibold mb-2">ภาพที่จะส่งตรวจสอบ:</h3>
                <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-64 object-contain bg-slate-100 shadow-md" />
                <button
                  onClick={handleRemoveFile}
                  className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                >
                  ยกเลิกรูปนี้
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
            />
            <input
              type="file"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
              accept="image/*"
              capture="environment"
              id="camera-input"
            />

            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="camera-input" className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer font-semibold text-sm">
                <CameraIcon className="h-5 w-5" />
                ถ่ายภาพ
              </label>
              <button
                onClick={handleResetSession}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold text-sm"
              >
                เริ่มใหม่ (Reset)
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!image || isLoading}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed font-bold text-lg"
            >
              {isLoading ? 'กำลังประมวลผล...' : 'ส่งตรวจสอบ (Identify)'}
            </button>
          </div>

          {/* --- RIGHT COLUMN: RESULT --- */}
          <div className="bg-slate-50 p-6 rounded-lg min-h-[300px] flex flex-col">
            <div className="flex-grow flex flex-col">

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4 animate-pulse my-auto">
                  <div className="h-6 bg-slate-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-32 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">แจ้งเตือน: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Result State */}
              {apiResult && !isLoading && !error && (
                <div className="space-y-6 animate-in fade-in duration-500">

                  {/* --- 1. ผลการทำนายรูปล่าสุด (Predicted) --- */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 border-b pb-2">
                      ผลวิเคราะห์รูปล่าสุด
                    </h3>
                    <ul className="space-y-3">
                      {apiResult.predicted?.slice(0, 3).map((item, idx) => {
                        const { score, sciName, thaiName } = normalizeResult(item);
                        const speciesInfo = supportedSpecies.find(s => s.scientific.toLowerCase() === sciName.toLowerCase());
                        return (
                          <li key={idx} className="flex justify-between items-center">
                            <div
                              className={`overflow-hidden ${speciesInfo?.page ? 'cursor-pointer hover:text-emerald-600 transition-colors' : ''}`}
                              onClick={() => speciesInfo && handleSpeciesClick(speciesInfo)}
                              title={speciesInfo?.page ? "คลิกเพื่อดูข้อมูลเพิ่มเติม" : ""}
                            >
                              <div className="font-bold text-slate-800 truncate">{thaiName}</div>
                              <div className="text-xs text-slate-500 italic truncate">{sciName}</div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ml-2 ${idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                              {(parseFloat(score) * 100).toFixed(0)}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* --- 2. ผลรวมสะสม (Overall) --- */}
                  <div className="bg-gradient-to-br from-slate-100 to-white p-4 rounded-lg shadow-inner border border-slate-200">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-300 pb-2">
                      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                        ผลสรุปสะสม ({apiResult.count} รูป)
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {apiResult.overall?.slice(0, 3).map((item, idx) => {
                        const { score, sciName, thaiName } = normalizeResult(item);
                        const speciesInfo = supportedSpecies.find(s => s.scientific.toLowerCase() === sciName.toLowerCase());
                        return (
                          <li key={idx} className="relative">
                            <div className="flex justify-between items-center z-10 relative mb-1">
                              <span
                                className={`font-semibold text-slate-800 text-sm truncate pr-2 ${speciesInfo?.page ? 'cursor-pointer hover:text-emerald-600 transition-colors' : ''}`}
                                onClick={() => speciesInfo && handleSpeciesClick(speciesInfo)}
                                title={speciesInfo?.page ? "คลิกเพื่อดูข้อมูลเพิ่มเติม" : ""}
                              >
                                {thaiName}
                              </span>
                              <span className="text-slate-600 text-sm font-bold">{(parseFloat(score) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-slate-400'}`}
                                style={{ width: `${parseFloat(score) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-right mt-0.5">{sciName}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && !apiResult && (
                <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <UploadIcon className="h-12 w-12 text-slate-300 mb-2" />
                  <p className="mb-1">ยังไม่มีข้อมูลการระบุพันธุ์ไม้</p>
                  <p className="text-sm">อัปโหลดภาพเพื่อเริ่มวิเคราะห์</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION: HISTORY --- */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-slate-800">
              ประวัติการส่งภาพ ({history.length} ภาพ)
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map((item) => {
              const topItem = (item.result.predicted && item.result.predicted.length > 0) ? item.result.predicted[0] : [];
              const { score, sciName, thaiName } = normalizeResult(topItem);
              const speciesInfo = supportedSpecies.find(s => s.scientific.toLowerCase() === sciName.toLowerCase());

              return (
                <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
                  {/* Image Thumbnail */}
                  <div className="h-32 w-full bg-slate-100">
                    <img src={item.imageUrl} alt="History" className="w-full h-full object-cover" />
                  </div>

                  {/* Result Info */}
                  <div className="p-2 text-xs flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-slate-400">
                        {item.timestamp.toLocaleTimeString('th-TH')}
                      </span>
                    </div>

                    <div>
                      <div
                        className={`font-bold text-slate-800 truncate ${speciesInfo?.page ? 'cursor-pointer hover:text-emerald-600' : ''}`}
                        title={speciesInfo?.page ? "คลิกเพื่อดูข้อมูลเพิ่มเติม" : thaiName}
                        onClick={() => speciesInfo && handleSpeciesClick(speciesInfo)}
                      >
                        {thaiName}
                      </div>
                      <div className="text-slate-500 italic truncate mb-1" title={sciName}>
                        {sciName}
                      </div>
                      <div className="mt-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                          {(parseFloat(score) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Species List Footer */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          ชนิดพันธุ์ที่รองรับ (60 ชนิด)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          {supportedSpecies.map((species) => (
            <div
              key={species.scientific}
              className={`p-2 rounded-lg transition-colors ${species.page ? 'cursor-pointer hover:bg-emerald-50' : ''}`}
              onClick={() => handleSpeciesClick(species)}
            >
              <p className={`font-medium ${species.page ? 'text-emerald-700' : 'text-slate-800'}`}>{species.common}</p>
              <p className="text-sm text-slate-500 italic truncate" title={species.scientific}>
                {species.scientific}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- SPECIES MODAL --- */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedSpecies.common}</h3>
                <p className="text-sm text-slate-500 italic">{selectedSpecies.scientific}</p>
              </div>
              <button
                onClick={closeSpeciesModal}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (PDF Iframe) */}
            <div className="flex-grow bg-slate-200 relative">
              {selectedSpecies.page ? (
                <iframe
                  key={selectedSpecies.page}
                  src={`/carbonpool/AI%20Green%20Area%2060%20Sp%20-%20SinglePages.pdf#page=${selectedSpecies.page}`}
                  className="w-full h-full"
                  title={`ข้อมูลพันธุ์ไม้ ${selectedSpecies.common}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  ไม่พบข้อมูล PDF สำหรับพันธุ์ไม้นี้
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AiTaxonomyPage;