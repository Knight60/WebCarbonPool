
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { UploadIcon, CameraIcon } from '../components/icons';

interface IdentificationResult {
  commonName: string;
  scientificName: string;
  description: string;
}

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
              <p className="mt-2 text-sm text-slate-600">ลากและวางไฟล์ที่นี่ หรือคลิกเพื่ออัปโหลด</p>
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
    </div>
  );
};

export default AiTaxonomyPage;
