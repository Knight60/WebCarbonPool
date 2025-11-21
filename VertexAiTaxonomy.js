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
  { common: "(17) กระถินเทพา", scientific: "Acacia mangium Willd." },
  { common: "(18) กระถินณรงค์", scientific: "Acacia auriculiformis A.Cunn. ex Benth." },
  { common: "(19) ถ่อน", scientific: "Alangium kurzii Craib" },
  { common: "(20) จำปาป่า", scientific: "Barringtonia macrostachya (Jack) Kurz" },
  { common: "(21) กาสะลองคำ", scientific: "Cinnamomum iners Reinw. ex Blume" },
  { common: "(22) หว้า", scientific: "Syzygium cumini (L.) Skeels" },
  { common: "(23) นนทรีป่า", scientific: "Peltophorum dasyrhachis (Miq.) Kurz" },
  { common: "(24) ตะโกนา", scientific: "Diospyros decandra Lour." },
  { common: "(25) ตะโกสวน", scientific: "Diospyros malabarica (Desr.) Kostel." },
  { common: "(26) ตะโกแผ่น", scientific: "Diospyros rhodocalyx Kurz" },
  { common: "(27) ตะเคียนหิน", scientific: "Hopea ferrea Laness." },
  { common: "(28) ตะเคียนทอง", scientific: "Shorea henryana Pierre ex Laness." },
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
  { common: "(59) แสมดำ", scientific: "Avicennia officinalis L." },
  { common: "(60) แสมทะเล", scientific: "Avicennia marina (Forssk.) Vierh." },
];
// --- END: Supported Species Data ---

const AiTaxonomyPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TaxonomyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedFile, setSubmittedFile] = useState<File | null>(null);
  const [source, setSource] = useState<'upload' | 'camera' | null>(null);
  const [token, setToken] = useState<string>('new'); // Default to 'new'
  const [apiResult, setApiResult] = useState<TaxonomyResponse | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Utility: Convert any image file to JPG before upload ---
  const convertFileToJpg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // ถ้าเป็น JPEG อยู่แล้ว ไม่ต้องแปลง
      if (file.type === 'image/jpeg') {
        resolve(file);
        return;
      }
      const image = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        image.src = e.target.result as string;
      };
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Cannot get canvas context'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
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
          0.9
        );
      };
      image.onerror = () => {
        reject(new Error('Invalid image file'));
      };
      reader.readAsDataURL(file);
    });
  };

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
      };
      reader.readAsDataURL(jpgFile);
      setSource('upload');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`ไม่สามารถแปลงไฟล์ภาพได้: ${err.message}`);
      } else {
        setError('เกิดข้อผิดพลาดในการแปลงไฟล์ภาพ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setSource(null);
    setApiResult(null);
    setSubmittedFile(null);
    setToken('new');
  };

  const clearSubmittedFile = () => {
    setSubmittedFile(null);
    setSource(null);
    setToken('new');
    // NOTE: ไม่ลบ image / previewUrl เพื่อให้รูปยังค้างอยู่ หากต้องการ reset ทั้งหมดใช้ clearImage()
  };

  // ฟังก์ชันสำหรับตรวจสอบชนิดไฟล์ก่อนส่ง identify
  const handleIdentifyClick = async () => {
    if (!image) {
      setError('กรุณาอัปโหลดภาพก่อน');
      return;
    }
  
    // ตรวจสอบชนิดไฟล์ก่อนส่ง
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      setError('ไฟล์นามสกุลไม่รองรับ กรุณาใช้ JPG, JPEG, PNG, หรือ WEBP');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('source', source || '');
      formData.append('token', token);

      const res = await fetch('http://localhost:3001/api/taxonomy-identify', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch from server');
      }
  
      const data: TaxonomyResponse = await res.json();
      console.log('API Response:', data);
  
      if (data.token) {
        setToken(data.token);
      }
  
      // กรณีไม่ใช่รูปต้นไม้
      if (data.error) {
        setError(data.details || data.error);
        setResult(null);
        setApiResult(data);
        clearSubmittedFile();
        return;
      }
  
      setResult(data);
      setApiResult(data);
      setSubmittedFile(image);
  
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

  const topPrediction = result?.predicted?.[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-emerald-700 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-xs text-center leading-tight">
                Carbon Pool
                <br />
                Project
              </span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm">
                Carbon Pool Project
              </div>
              <div className="text-xs">
                โครงการภาคีความร่วมมือการสำรวจคาร์บอนในพื้นที่สีเขียว
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-emerald-200">
              หน้าแรก
            </a>
            <a href="#" className="hover:text-emerald-200">
              แปลงสำรวจ
            </a>
            <a href="#" className="hover:text-emerald-200">
              บันทึกไม้
            </a>
            <a href="#" className="hover:text-emerald-200">
              AI Spatial
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-full bg-white text-emerald-700 font-semibold"
            >
              AI Taxonomy
            </a>
            <a href="#" className="hover:text-emerald-200">
              Open Data
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex-1 w-full px-4 py-6 space-y-6">
        {/* Title Section */}
        <section className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-800">
            AI Taxonomy - ระบบจำแนกพันธุ์ไม้
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            อัปโหลดภาพ (เปลือกไม้/ใบ/ไม้) เพื่อระบุชนิดพันธุ์ด้วย Gemini AI
          </p>
        </section>

        {/* Top Panel: Upload + Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Upload Area */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              อัปโหลดภาพ
            </h2>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 cursor-pointer hover:border-emerald-400 transition"
              onClick={handleUploadClick}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-h-48 mb-4 rounded-md object-contain"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <UploadIcon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-slate-700 font-medium">
                    ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกอัปโหลด
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    รองรับไฟล์: JPG, JPEG, PNG, WEBP
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </div>

            <div className="flex justify-between items-center mt-4 gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <UploadIcon className="w-4 h-4" />
                  <span>อัปโหลดภาพ</span>
                </button>

                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  <RefreshIcon className="w-4 h-4" />
                  <span>เริ่มใหม่ (Reset)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleIdentifyClick}
                disabled={!image || isLoading}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold ${
                  !image || isLoading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <CameraIcon className="w-4 h-4" />
                <span>{isLoading ? 'กำลังวิเคราะห์...' : 'ส่งตรวจสอบ (Identify)'}</span>
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-left">
                {error}
              </div>
            )}
          </div>

          {/* Right: Result Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 min-h-[260px]">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              ผลการจำแนกพันธุ์ไม้
            </h2>

            {!apiResult && !isLoading && (
              <p className="text-sm text-slate-500">
                ยังไม่มีข้อมูลการระบุพันธุ์ไม้ อัปโหลดภาพเพื่อเริ่มวิเคราะห์
              </p>
            )}

            {isLoading && (
              <div className="text-sm text-slate-500">
                กำลังวิเคราะห์ภาพด้วย Gemini AI...
              </div>
            )}

            {apiResult && (
              <div className="space-y-4">
                {apiResult.error ? (
                  // กรณีไม่ใช่รูปต้นไม้
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                    <div className="font-semibold mb-1">ไม่สามารถจำแนกพันธุ์ไม้</div>
                    <div>{apiResult.details || apiResult.error}</div>
                  </div>
                ) : (
                  <>
                    {/* Top predicted species */}
                    {topPrediction && (
                      <div className="border border-emerald-100 rounded-lg p-3 bg-emerald-50">
                        <div className="text-xs text-emerald-700 font-semibold">
                          ผลลัพธ์ที่เป็นไปได้มากที่สุด
                        </div>
                        <div className="text-sm font-bold text-emerald-900 mt-1">
                          {topPrediction[0]}
                        </div>
                        <div className="text-xs text-emerald-700 mt-1">
                          ความเชื่อมั่น (Confidence): {topPrediction[1]}
                        </div>
                      </div>
                    )}

                    {/* Overall Stats */}
                    {apiResult.overall && apiResult.overall.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-slate-800 mb-1">
                          ผลการระบุภาพทั้งหมดใน session นี้
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {apiResult.overall.map(([sci, score], idx) => (
                            <li key={`${sci}-${idx}`} className="flex justify-between">
                              <span className="truncate w-2/3" title={sci}>
                                {sci}
                              </span>
                              <span className="ml-2 text-right w-1/3">
                                {score}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Count & Token */}
                    <div className="text-xs text-slate-500">
                      <div>จำนวนภาพที่วิเคราะห์ใน session นี้: {apiResult.count ?? 0}</div>
                      <div>Session Token: {apiResult.token}</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Species List Footer */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            ฐานข้อมูลพันธุ์ไม้ที่รองรับ (60 ชนิด)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
            {supportedSpecies.map((species) => (
              <div key={species.scientific}>
                <p className="text-slate-800 font-medium text-sm">{species.common}</p>
                <p className="text-xs text-slate-500 italic truncate" title={species.scientific}>
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
