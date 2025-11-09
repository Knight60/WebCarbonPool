import React, { useState, useRef } from 'react';
import { UploadIcon, CameraIcon, XCircleIcon } from '../components/icons';

interface IdentificationResult {
  commonName: string;
  scientificName: string;
  description: string;
}

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

const imageTypeOptions = [
  { value: "bark", label: "เปลือก" },
  { value: "tree", label: "ทรงพุ่ม" },
  { value: "lbup", label: "ด้านบนใบติดกิ่ง" },
  { value: "lbun", label: "ด้านล่างใบติดกิ่ง" },
  { value: "lfup", label: "ด้านบนใบเดี่ยว" },
  { value: "lfun", label: "ด้านล่างใบเดี่ยว" },
  { value: "llup", label: "ด้านบนใบย่อย" },
  { value: "llun", label: "ด้านล่างใบย่อย" },
  { value: "flow", label: "ดอก" },
  { value: "frui", label: "ผล" },
];

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
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageType, setImageType] = useState<string>('bark');


  const handleFileSelect = async (file: File | null | undefined) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('ไฟล์นามสกุลไม่รองรับ กรุณาใช้ JPG, JPEG, PNG, หรือ WEBP');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
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
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('กรุณาเลือกรูปภาพก่อน');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('token', 'New');
    formData.append('email', 'pisut.nak@gmail.com');
    formData.append('type', imageType);
    formData.append('image', image);

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://aigreen.dcce.go.th/ai-taxonomy.html'
      },
      body: formData,
    };

    try {
      const response = await fetch('https://aigreen.dcce.go.th/ai/taxonomy/New', fetchOptions);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.predicted || data.predicted.length === 0) {
        throw new Error('ไม่พบผลลัพธ์การทำนายจากเซิร์ฟเวอร์');
      }

      // 4. แปลงผลลัพธ์เพื่อแสดงผล
      const topPrediction = data.predicted[0]; // e.g., ["Avicennia alba", "99.9%"]
      const scientificNameFromApi = topPrediction[0]; // e.g., "Avicennia alba"
      const confidence = topPrediction[1];

      // --- START: MODIFIED LOGIC ---
      // ค้นหาชื่อสามัญโดยเทียบว่า "ชื่อในลิสต์" (ตัวเต็ม)
      // "เริ่มต้นด้วย" "ชื่อจาก API" (ตัวย่อ/ไม่มี Author) หรือไม่
      const matchingSpecies = supportedSpecies.find(
        (species) => species.scientific.startsWith(scientificNameFromApi)
      );

      // ลบ (N) ออกจากชื่อ
      const commonName = matchingSpecies 
        ? matchingSpecies.common.replace(/\(\d+\)\s/, '') 
        : "ไม่พบชื่อในลิสต์ 60 ชนิด"; // แจ้งว่าหาไม่เจอ

      // ตั้งค่า state
      setResult({
        commonName: commonName,
        // ถ้าเจอในลิสต์ ให้ใช้ชื่อเต็มจากลิสต์ (สวยกว่า)
        // ถ้าไม่เจอ ก็ใช้ชื่อที่ API ส่งมา
        scientificName: matchingSpecies ? matchingSpecies.scientific : scientificNameFromApi,
        description: `ความมั่นใจ: ${confidence}` // ใช้ description field เพื่อแสดงค่าความมั่นใจ
      });
      // --- END: MODIFIED LOGIC ---

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`เกิดข้อผิดพลาดในการระบุพันธุ์ไม้: ${err.message}`);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 th-font max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">AI Taxonomy - ระบบจำแนกพันธุ์ไม้</h1>
        <p className="mt-2 text-slate-600">
          อัปโหลดหรือถ่ายภาพต้นไม้เพื่อให้ AI ช่วยระบุชนิดพันธุ์
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Upload & Preview */}
          <div className="space-y-4">

            <div>
              <label htmlFor="image-type" className="block text-sm font-medium text-slate-700 mb-1">
                ชนิดของภาพ (Type)
              </label>
              <select
                id="image-type"
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              >
                {imageTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
                <h3 className="font-semibold mb-2">ภาพตัวอย่าง:</h3>
                <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-auto object-cover shadow-md" />
                <button
                  onClick={handleRemoveFile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors font-semibold"
                >
                  {/* <XCircleIcon className="h-5 w-5" /> */}
                  ลบไฟล์นี้
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
            <label htmlFor="camera-input" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer font-semibold">
              <CameraIcon className="h-5 w-5" />
              ถ่ายภาพจากกล้อง
            </label>
            
            <button
              onClick={handleSubmit}
              disabled={!image || isLoading}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed font-bold text-lg"
            >
              {isLoading ? 'กำลังประมวลผล...' : 'ระบุชนิดพันธุ์ไม้'}
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="bg-slate-50 p-6 rounded-lg min-h-[300px] flex flex-col justify-center">
            {isLoading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-slate-300 rounded w-3/4"></div>
                <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                <div className="h-4 bg-slate-300 rounded w-full"></div>
                <div className="h-4 bg-slate-300 rounded w-full"></div>
                <div className="h-4 bg-slate-300 rounded w-5/6"></div>
              </div>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {result && !isLoading && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">ชื่อสามัญ</h3>
                  <p className="text-2xl font-bold text-emerald-600">{result.commonName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">ชื่อวิทยาศาสตร์</h3>
                  <p className="text-lg font-medium text-slate-800 italic">{result.scientificName}</p>
_
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">รายละเอียด</h3>
                  <p className="text-base text-slate-700 leading-relaxed">{result.description}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && !result && (
              <div className="text-center text-slate-500">
                <p>ผลลัพธ์การระบุชนิดพันธุ์ไม้จะแสดงที่นี่</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Supported Species Section --- */}
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
      {/* --- END: Supported Species Section --- */}

    </div>
  );
};

export default AiTaxonomyPage;