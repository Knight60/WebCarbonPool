import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { UploadIcon, CameraIcon } from '../components/icons';

interface IdentificationResult {
  commonName: string;
  scientificName: string;
  description: string;
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

const AiTaxonomyPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('กรุณาเลือกรูปภาพก่อน');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
      
      const imagePart = await fileToGenerativePart(image);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [
            imagePart,
            { text: 'From the provided image of a plant, identify its species. Provide the common Thai name, scientific name, and a brief description of its key characteristics. Respond in JSON format.' },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              commonName: { type: Type.STRING, description: "The common name of the plant in Thai." },
              scientificName: { type: Type.STRING, description: "The scientific name of the plant." },
              description: { type: Type.STRING, description: "A brief description of the plant's characteristics." },
            },
            required: ["commonName", "scientificName", "description"],
          },
        },
      });

      const jsonText = (response.text ?? '').trim();
      const parsedResult: IdentificationResult = JSON.parse(jsonText);
      setResult(parsedResult);

    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการระบุพันธุ์ไม้ กรุณาลองใหม่อีกครั้ง');
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
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              onClick={triggerFileInput}
              onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } } as any); }}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
              {/* --- START: FIXED LINE 1 --- */}
              <p className="mt-2 text-sm text-slate-600">ลากและวางไฟล์ที่นี่ หรือคลิกเพื่ออัปโหลด</p>
              {/* --- END: FIXED LINE 1 --- */}
              <p className="text-xs text-slate-500">PNG, JPG, WEBP</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              capture="environment"
              id="camera-input"
            />
            <label htmlFor="camera-input" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer font-semibold">
              <CameraIcon className="h-5 w-5" />
              ถ่ายภาพจากกล้อง
            </label>
            {previewUrl && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">ภาพตัวอย่าง:</h3>
                <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-auto object-cover shadow-md" />
              </div>
            )}
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
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">ลักษณะ</h3>
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

      {/* --- Supported Species Section (Updated) --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          ชนิดพันธุ์ที่รองรับ (60 ชนิด)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          {supportedSpecies.map((species) => (
            <div key={species.scientific}>
              <p className="text-slate-800 font-medium">{species.common}</p>
              {/* --- START: FIXED LINE 2 & 3 --- */}
              <p className="text-sm text-slate-500 italic truncate" title={species.scientific}>
                {species.scientific}
              </p>
              {/* --- END: FIXED LINE 2 & 3 --- */}
            </div>
          ))}
        </div>
      </div>
      {/* --- END: Supported Species Section --- */}

    </div>
  );
};

export default AiTaxonomyPage;