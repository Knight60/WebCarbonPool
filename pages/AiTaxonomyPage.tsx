import React, { useState, useRef } from 'react';
import { UploadIcon, CameraIcon, RefreshIcon } from '../components/icons'; // สมมติว่ามี RefreshIcon หรือใช้ text แทนได้

// --- Interface สำหรับ Response จาก VertexAiTaxonomy.js ---
interface TaxonomyResponse {
  filename?: string;
  token: string;
  source?: string;
  predicted?: [string, string][]; // [ScientificName, Score]
  overall?: [string, string][];    // [ScientificName, Score]
  count?: number;
  error?: string;                 // กรณีไม่ใช่รูปต้นไม้
  details?: string;
}

// --- START: Supported Species Data ---
const supportedSpecies = [
    { common: "(1) แสมขาว", scientific: "Avicennia alba Blume" },
    { common: "(2) อโศกอินเดีย", scientific: "Monoon longifolium (Sonn.) B.Xue & R.M.K.Saunders" },
    { common: "(3) ลำดวน", scientific: "Sphaerocoryne lefevrei (Baill.) D.M.Johnson & N.A.Murray" },
    { common: "(4) สัตตบรรณ", scientific: "Alstonia scholaris (L.) R.Br." },
    { common: "(5) ตีนเป็ดทะเล", scientific: "Cerbera odollam Gaertn." },
    { common: "(6) โมกมัน", scientific: "Wrightia arborea (Dennst.) Mabb." },
    { common: "(7) แคนา", scientific: "Dolichandrone serrulata (Wall. ex DC.) Seem." },
    { common: "(8) ปีบ", scientific: "Millingtonia hortensis L.f." },
    { common: "(9) ชมพูพันธุ์ทิพย์", scientific: "Tabebuia rosea (Bertol.) DC." },
    { common: "(10) กระทิง", scientific: "Calophyllum inophyllum L." },
    { common: "(11) สารภี", scientific: "Mammea siamensis (Miq.) T.Anderson" },
    { common: "(12) สนทะเล", scientific: "Casuarina equisetifolia L." },
    { common: "(13) สมอพิเภก", scientific: "Terminalia bellirica (Gaertn.) Roxb." },
    { common: "(14) หูกวาง", scientific: "Terminalia catappa L." },
    { common: "(15) หูกระจง", scientific: "Terminalia ivorensis A.Chev." },
    { common: "(16) พะยอม", scientific: "Anthoshorea roxburghii (G.Don) P.S.Ashton & J.Heck." },
    { common: "(17) ยางนา", scientific: "Dipterocarpus alatus Roxb. ex G.Don" },
    { common: "(18) ตะเคียนทอง", scientific: "Hopea odorata Roxb." },
    { common: "(19) รัง", scientific: "Pentacme siamensis (Miq.) Kurz" },
    { common: "(20) เต็ง", scientific: "Shorea obtusa Wall. ex Blume" },
    { common: "(21) ยางพารา", scientific: "Hevea brasiliensis (Willd. ex A.Juss.) Müll.Arg." },
    { common: "(22) กระถินณรงค์", scientific: "Acacia auriculiformis A.Cunn. ex Benth." },
    { common: "(23) กระถินเทพา", scientific: "Acacia mangium Willd." },
    { common: "(24) มะค่าโมง", scientific: "Afzelia xylocarpa (Kurz) Craib" },
    { common: "(25) พฤกษ์", scientific: "Albizia lebbeck (L.) Benth." },
    { common: "(26) ทองกวาว", scientific: "Butea monosperma (Lam.) Kuntze" },
    { common: "(27) กัลปพฤกษ์", scientific: "Cassia bakeriana Craib" },
    { common: "(28) คูน", scientific: "Cassia fistula L." },
    { common: "(29) พะยูง", scientific: "Dalbergia cochinchinensis Pierre" },
    { common: "(30) ฉนวน", scientific: "Dalbergia nigrescens Kurz" },
    { common: "(31) หางนกยูงฝรั่ง", scientific: "Delonix regia (Bojer ex Hook.) Raf." },
    { common: "(32) เขลง", scientific: "Dialium cochinchinense Pierre" },
    { common: "(33) อะราง", scientific: "Peltophorum dasyrhachis (Miq.) Kurz" },
    { common: "(34) นนทรี", scientific: "Peltophorum pterocarpum (DC.) Backer ex K.Heyne" },
    { common: "(35) ประดู่บ้าน", scientific: "Pterocarpus indicus Willd." },
    { common: "(36) ประดู่ป่า", scientific: "Pterocarpus macrocarpus Kurz" },
    { common: "(37) จามจุรี", scientific: "Samanea saman (Jacq.) Merr." },
    { common: "(38) ขี้เหล็ก", scientific: "Senna siamea (Lam.) H.S.Irwin & Barneby" },
    { common: "(39) มะค่าแต้", scientific: "Sindora siamensis Teijsm. ex Miq." },
    { common: "(40) มะขาม", scientific: "Tamarindus indica L." },
    { common: "(41) แดง", scientific: "Xylia xylocarpa var. kerrii (Craib & Hutch.) I.C.Nielsen" },
    { common: "(42) สัก", scientific: "Tectona grandis L.f." },
    { common: "(43) จิกน้ำ", scientific: "Barringtonia acutangula (L.) Gaertn." },
    { common: "(44) กระโดน", scientific: "Careya arborea Roxb." },
    { common: "(45) ตะแบกนา", scientific: "Lagerstroemia floribunda Jack" },
    { common: "(46) อินทรชิต", scientific: "Lagerstroemia loudonii Teijsm. & Binn." },
    { common: "(47) อินทนิลน้ำ", scientific: "Lagerstroemia speciosa (L.) Pers." },
    { common: "(48) จำปี", scientific: "Magnolia × alba (DC.) Figlar" },
    { common: "(49) สะเดา", scientific: "Azadirachta indica A.Juss." },
    { common: "(50) มะฮอกกานีใบใหญ่", scientific: "Swietenia macrophylla King" },
    { common: "(51) ขนุน", scientific: "Artocarpus heterophyllus Lam." },
    { common: "(52) ไทรย้อยใบแหลม", scientific: "Ficus benjamina L." },
    { common: "(53) โพศรีมหาโพ", scientific: "Ficus religiosa L." },
    { common: "(54) โพขี้นก", scientific: "Ficus rumphii Blume" },
    { common: "(55) ข่อย", scientific: "Streblus asper Lour." },
    { common: "(56) หว้า", scientific: "Syzygium cumini (L.) Skeels" },
    { common: "(57) โกงกางใบเล็ก", scientific: "Rhizophora apiculata Blume" },
    { common: "(58) โกงกางใบใหญ่", scientific: "Rhizophora mucronata Poir." },
    { common: "(59) คำมอกหลวง", scientific: "Gardenia sootepensis Hutch." },
    { common: "(60) พิกุล", scientific: "Mimusops elengi L." },
];
// --- END: Supported Species Data ---

// Helper function to match scientific name to Thai common name
const getThaiName = (sciName: string) => {
    const found = supportedSpecies.find(s => s.scientific.toLowerCase() === sciName.toLowerCase());
    return found ? found.common : sciName; // ถ้าไม่เจอให้โชว์ชื่อวิทย์
};

// --- START: File Conversion Function (Unchanged) ---
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
// --- END: File Conversion Function ---


const AiTaxonomyPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // New State Logic for VertexAiTaxonomy
  const [token, setToken] = useState<string>('new'); // Default to 'new'
  const [apiResult, setApiResult] = useState<TaxonomyResponse | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | null | undefined) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('ไฟล์นามสกุลไม่รองรับ กรุณาใช้ JPG, JPEG, PNG, หรือ WEBP');
      return;
    }
    setIsLoading(true);
    setError(null);
    // Don't clear apiResult immediately if we want to show previous overall stats, 
    // but usually it's better to clear "current" result perception. 
    // For now, let's keep previous result visible until new one arrives or error.
    
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
    handleRemoveFile();
    alert('รีเซ็ตเซสชันเรียบร้อย เริ่มต้นการจำแนกชุดใหม่');
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
    formData.append('type', 'bark'); // Default or add UI selector for 'leaf'/'bark'

    try {
      // Use the current token (or 'new' if it's the first time)
      const url = `http://localhost:8888/ai/taxonomy/${token}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data: TaxonomyResponse = await response.json();

      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`Server error: ${response.status}`);
      }

      // Update Token from response (for continuity)
      if (data.token) {
        setToken(data.token);
      }

      // Check for Logic Error (e.g. Not a plant)
      if (data.error) {
        setError(data.error); // e.g. "ไม่ใช่รูปของต้นไม้"
        // Keep the token to allow retry in same session if needed, 
        // or you might want to force reset.
      } else {
        setApiResult(data);
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

  return (
    <div className="space-y-6 th-font max-w-4xl mx-auto">
      <div className="text-center relative">
        <h1 className="text-3xl font-bold text-slate-800">AI Taxonomy - ระบบจำแนกพันธุ์ไม้</h1>
        <p className="mt-2 text-slate-600">
          อัปโหลดภาพ (เปลือกไม้/ใบไม้) เพื่อระบุชนิดพันธุ์ด้วย Gemini AI
        </p>
        {/* Session Info */}
        <div className="absolute top-0 right-0 text-xs text-slate-400 hidden md:block">
             Session: {token === 'new' ? 'New' : token.substring(0, 16)+'...'}
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
                <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-auto object-cover shadow-md" />
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
            <div className="flex-grow min-h-[150px] flex flex-col justify-center">
              
              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-slate-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-32 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">แจ้งเตือน: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Result State */}
              {apiResult && !isLoading && !error && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  
                    {/* --- 1. ผลการทำนายรูปล่าสุด --- */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 border-b pb-2">
                            ผลวิเคราะห์รูปนี้ (Predicted)
                        </h3>
                        <ul className="space-y-3">
                            {apiResult.predicted?.slice(0, 3).map(([sciName, score], idx) => (
                                <li key={idx} className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-slate-800">{getThaiName(sciName)}</div>
                                        <div className="text-xs text-slate-500 italic">{sciName}</div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {(parseFloat(score) * 100).toFixed(0)}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 2. ผลรวม (Overall) --- */}
                    <div className="bg-gradient-to-br from-slate-100 to-white p-4 rounded-lg shadow-inner border border-slate-200">
                        <div className="flex justify-between items-center mb-3 border-b border-slate-300 pb-2">
                            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                                ผลสรุปสะสม (Overall)
                            </h3>
                            <span className="text-xs bg-slate-600 text-white px-2 py-0.5 rounded">
                                จาก {apiResult.count} รูป
                            </span>
                        </div>
                        
                        <ul className="space-y-3">
                             {apiResult.overall?.slice(0, 3).map(([sciName, score], idx) => (
                                <li key={idx} className="relative">
                                    {/* Progress Bar Background */}
                                    <div className="flex justify-between items-center z-10 relative mb-1">
                                        <span className="font-semibold text-slate-800 text-sm">{getThaiName(sciName)}</span>
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
                            ))}
                        </ul>
                    </div>

                    <div className="text-center text-xs text-slate-400 mt-2">
                        Token: {apiResult.token.substring(0, 19).replace('T', ' ')}...
                    </div>

                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && !apiResult && (
                <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                  <p className="mb-2">ยังไม่มีข้อมูลการระบุพันธุ์ไม้</p>
                  <p className="text-sm">อัปโหลดภาพเพื่อเริ่มวิเคราะห์</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          ชนิดพันธุ์ที่รองรับ (60 ชนิด)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          {supportedSpecies.map((species) => (
            <div key={species.scientific}>
              <p className="text-slate-800 font-medium">{species.common}</p>
              <p className="text-sm text-slate-500 italic truncate" title={species.scientific}>
                {species.scientific}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AiTaxonomyPage;